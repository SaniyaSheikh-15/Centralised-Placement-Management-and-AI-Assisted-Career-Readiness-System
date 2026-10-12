"""End-to-end verification of every AI endpoint (in-process, no network).

Boots the FastAPI app against a throwaway SQLite database, seeds the demo data,
then drives each endpoint through an in-process ASGI client and reports a
PASS/FAIL summary. This is the script used to validate the API from Swagger /
the terminal and to populate ``process/brain.md``.

Run::

    backend/.venv/Scripts/python backend/scripts/verify_endpoints.py

It exits with a non-zero status if any endpoint fails, so it doubles as a smoke
test in CI.
"""

from __future__ import annotations

import asyncio
import json
import os
import pathlib
import sys

# --- Bootstrap import paths + test configuration -----------------------
BACKEND_DIR = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

# Use an isolated DB and the offline AI provider so the run is deterministic
# and needs no external services.
VERIFY_DB = BACKEND_DIR / "_verify.db"
if VERIFY_DB.exists():
    VERIFY_DB.unlink()
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{VERIFY_DB.as_posix()}"
os.environ["AI_PROVIDER"] = "stub"
os.environ["SEED_DEMO_DATA"] = "true"

from httpx import ASGITransport, AsyncClient  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.db import seed as seed_module  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402

# Collected results: (name, method, path, status, passed, note)
RESULTS: list[dict[str, object]] = []


def record(name: str, method: str, path: str, status: int, passed: bool, note: str = "") -> None:
    """Append a single check to the report."""
    RESULTS.append(
        {"name": name, "method": method, "path": path, "status": status, "passed": passed, "note": note}
    )
    flag = "PASS" if passed else "FAIL"
    print(f"[{flag}] {method:6} {path:45} -> {status}  {note}")


async def bootstrap() -> None:
    """Create the schema and seed demo data in the isolated database."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    if settings.seed_demo_data:
        async with SessionLocal() as session:
            await seed_module.seed_demo_data(session)
            await session.commit()


async def run_checks() -> None:
    """Exercise every endpoint and record the outcome."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # --- Health -------------------------------------------------
        r = await client.get("/health")
        record("Health check", "GET", "/health", r.status_code, r.status_code == 200)

        # --- Auth ---------------------------------------------------
        r = await client.post(
            "/api/v1/auth/dev-login", json={"email": seed_module.DEMO_STUDENT_EMAIL}
        )
        record("Dev login (student)", "POST", "/api/v1/auth/dev-login", r.status_code, r.status_code == 200)
        tokens = r.json() if r.status_code == 200 else {}
        # The API serialises camelCase, so the field is ``accessToken``.
        headers = {"Authorization": f"Bearer {tokens.get('accessToken', '')}"}

        r = await client.get("/api/v1/auth/me", headers=headers)
        me = r.json() if r.status_code == 200 else {}
        student_id = me.get("studentId")
        record("Current identity", "GET", "/api/v1/auth/me", r.status_code, bool(student_id), f"roles={me.get('roles')}")

        # Negative: unauthenticated request must be 401.
        r = await client.get("/api/v1/interviews/history")
        record("Unauthenticated rejected", "GET", "/api/v1/interviews/history", r.status_code, r.status_code == 401)

        # Negative: wrong password must be 401.
        r = await client.post(
            "/api/v1/auth/login", json={"email": seed_module.DEMO_STUDENT_EMAIL, "password": "wrong"}
        )
        record("Bad password rejected", "POST", "/api/v1/auth/login", r.status_code, r.status_code == 401)

        # --- Module 1: interviews -----------------------------------
        r = await client.post(
            "/api/v1/interviews/start",
            headers=headers,
            json={"role": "Backend Developer", "difficulty": "Intermediate", "type": "Technical", "questionCount": 3},
        )
        record("Start interview", "POST", "/api/v1/interviews/start", r.status_code, r.status_code == 201)
        start = r.json() if r.status_code == 201 else {}
        session_id = start.get("sessionId")
        question = start.get("firstQuestion", {})
        total = start.get("totalQuestions", 3)

        # Answer every question until the session completes.
        answered = 0
        current_q = question
        last = {}
        while current_q and answered < total:
            r = await client.post(
                f"/api/v1/interviews/{session_id}/answer",
                headers=headers,
                json={
                    "questionId": current_q["id"],
                    "answer": (
                        "Because reliability matters, I would design the API with JWT auth, "
                        "versioning, pagination, caching and a caching layer; for example I used "
                        "Redis in my last project which improved latency by 40%."
                    ),
                },
            )
            answered += 1
            last = r.json() if r.status_code == 200 else {}
            current_q = last.get("nextQuestion")
            if not r.status_code == 200:
                break
        record(
            f"Submit {answered} answer(s)",
            "POST",
            "/api/v1/interviews/{id}/answer",
            r.status_code,
            answered == total and last.get("isComplete") is True,
            f"complete={last.get('isComplete')}",
        )

        # Duplicate answer to a finished session must be 409.
        r = await client.post(
            f"/api/v1/interviews/{session_id}/answer",
            headers=headers,
            json={"questionId": question.get("id", ""), "answer": "again"},
        )
        record("Reject answer on finished session", "POST", "/api/v1/interviews/{id}/answer", r.status_code, r.status_code == 409)

        # Result report.
        r = await client.get(f"/api/v1/interviews/{session_id}/result", headers=headers)
        result = r.json() if r.status_code == 200 else {}
        record(
            "Interview result",
            "GET",
            "/api/v1/interviews/{id}/result",
            r.status_code,
            r.status_code == 200 and "scoreBreakdown" in result,
            f"overall={result.get('overallScore')}",
        )

        # History.
        r = await client.get("/api/v1/interviews/history", headers=headers)
        hist = r.json() if r.status_code == 200 else {}
        record(
            "Interview history",
            "GET",
            "/api/v1/interviews/history",
            r.status_code,
            r.status_code == 200 and hist.get("totalSessions", 0) >= 1,
            f"sessions={hist.get('totalSessions')}",
        )

        # Unknown session must be 404.
        r = await client.get(
            "/api/v1/interviews/00000000-0000-0000-0000-000000000000/result", headers=headers
        )
        record("Unknown session 404", "GET", "/api/v1/interviews/{id}/result", r.status_code, r.status_code == 404)

        # --- Module 2: assistant ------------------------------------
        r = await client.post(
            "/api/v1/assistant/chat",
            headers=headers,
            json={"message": "How do I prepare for the upcoming Google drive?", "studentId": student_id},
        )
        chat = r.json() if r.status_code == 200 else {}
        record(
            "Career chat (RAG)",
            "POST",
            "/api/v1/assistant/chat",
            r.status_code,
            r.status_code == 200 and bool(chat.get("reply")),
            f"grounded_on={len(chat.get('groundedOn', []))}",
        )

        r = await client.post(
            "/api/v1/assistant/resume-qa",
            headers=headers,
            json={"question": "What are the weaknesses of my resume?", "studentId": student_id},
        )
        record(
            "Resume Q&A",
            "POST",
            "/api/v1/assistant/resume-qa",
            r.status_code,
            r.status_code == 200 and "answer" in r.json(),
        )

        r = await client.get(f"/api/v1/assistant/guidance/{student_id}", headers=headers)
        guidance = r.json() if r.status_code == 200 else {}
        record(
            "Career guidance",
            "GET",
            "/api/v1/assistant/guidance/{student_id}",
            r.status_code,
            r.status_code == 200 and bool(guidance.get("roadmap")),
            f"role={guidance.get('recommendedRole')}",
        )

        # Negative: student cannot read another student's guidance (RBAC).
        r = await client.get(
            "/api/v1/assistant/guidance/11111111-1111-1111-1111-111111111111", headers=headers
        )
        record("RBAC blocks other student", "GET", "/api/v1/assistant/guidance/{other}", r.status_code, r.status_code == 403)


async def main() -> int:
    """Bootstrap, run all checks, write the report, return exit code."""
    await bootstrap()
    await run_checks()

    passed = sum(1 for item in RESULTS if item["passed"])
    total = len(RESULTS)
    report = {
        "passed": passed,
        "total": total,
        "all_passed": passed == total,
        "ai_provider": settings.resolved_ai_provider,
        "results": RESULTS,
    }
    out = BACKEND_DIR / "_verify_report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\nRESULT: {passed}/{total} checks passed. Report: {out}")

    await engine.dispose()
    return 0 if passed == total else 1


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
