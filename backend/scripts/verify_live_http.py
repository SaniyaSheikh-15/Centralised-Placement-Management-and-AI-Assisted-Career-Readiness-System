"""Live HTTP verification against a running server.

Unlike ``verify_endpoints.py`` (which is in-process), this script talks to an
already-running uvicorn server over **real HTTP**, exactly as Swagger UI or the
frontend would. It performs the full Module 1 + Module 2 flow plus the
authentication and RBAC checks, prints a PASS/FAIL table, writes
``backend/_verify_live.json`` and exits non-zero on any failure.

Usage (server must already be running)::

    backend/.venv/Scripts/python backend/scripts/verify_live_http.py
    backend/.venv/Scripts/python backend/scripts/verify_live_http.py http://127.0.0.1:8000
"""

from __future__ import annotations

import asyncio
import json
import pathlib
import sys

import httpx

DEFAULT_BASE_URL = "http://127.0.0.1:8000"
DEMO_STUDENT_EMAIL = "student@campusconnect.dev"
DEMO_STUDENT_PASSWORD = "Password123"
DEMO_OFFICER_EMAIL = "officer@campusconnect.dev"

RESULTS: list[dict[str, object]] = []


def record(name: str, method: str, path: str, status: int, passed: bool, note: str = "") -> None:
    """Append one check to the report and echo it."""
    RESULTS.append(
        {"name": name, "method": method, "path": path, "status": status, "passed": passed, "note": note}
    )
    print(f"[{'PASS' if passed else 'FAIL'}] {method:6} {path:46} -> {status}  {note}")


async def run(base_url: str) -> int:
    """Drive every endpoint against ``base_url`` and report the outcome."""
    async with httpx.AsyncClient(base_url=base_url, timeout=60.0) as client:
        # --- Health / docs ------------------------------------------
        r = await client.get("/health")
        record("Health check", "GET", "/health", r.status_code, r.status_code == 200)

        r = await client.get("/openapi.json")
        spec = r.json() if r.status_code == 200 else {}
        record(
            "OpenAPI schema (Swagger)",
            "GET",
            "/openapi.json",
            r.status_code,
            r.status_code == 200 and len(spec.get("paths", {})) >= 16,
            f"paths={len(spec.get('paths', {}))}",
        )

        r = await client.get("/docs")
        record("Swagger UI", "GET", "/docs", r.status_code, r.status_code == 200)

        r = await client.get("/redoc")
        record("ReDoc UI", "GET", "/redoc", r.status_code, r.status_code == 200)

        r = await client.get("/")
        record("Root banner", "GET", "/", r.status_code, r.status_code == 200)

        # --- Authentication -----------------------------------------
        r = await client.post("/api/v1/auth/login", json={"email": DEMO_STUDENT_EMAIL, "password": DEMO_STUDENT_PASSWORD})
        record("Login (email+password)", "POST", "/api/v1/auth/login", r.status_code, r.status_code == 200)
        tokens = r.json() if r.status_code == 200 else {}
        headers = {"Authorization": f"Bearer {tokens.get('accessToken', '')}"}

        # Refresh rotation.
        r = await client.post(
            "/api/v1/auth/refresh", json={"refreshToken": tokens.get("refreshToken", "")}
        )
        record("Refresh token rotation", "POST", "/api/v1/auth/refresh", r.status_code, r.status_code == 200)

        r = await client.get("/api/v1/auth/me", headers=headers)
        me = r.json() if r.status_code == 200 else {}
        student_id = me.get("studentId")
        record("Whoami", "GET", "/api/v1/auth/me", r.status_code, bool(student_id), f"roles={me.get('roles')}")

        # --- Negative auth ------------------------------------------
        r = await client.get("/api/v1/interviews/history")
        record("401 without token", "GET", "/api/v1/interviews/history", r.status_code, r.status_code == 401)

        r = await client.post("/api/v1/auth/login", json={"email": DEMO_STUDENT_EMAIL, "password": "nope"})
        record("401 wrong password", "POST", "/api/v1/auth/login", r.status_code, r.status_code == 401)

        # --- Module 1: AI Mock Interview ----------------------------
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

        answered, last, current_q = 0, {}, question
        while current_q and answered < total:
            r = await client.post(
                f"/api/v1/interviews/{session_id}/answer",
                headers=headers,
                json={
                    "questionId": current_q["id"],
                    "answer": (
                        "I would design the service around clear interfaces, add JWT auth, "
                        "version the API, paginate list endpoints and add caching. In my last "
                        "project this cut p95 latency by 40 percent."
                    ),
                },
            )
            answered += 1
            last = r.json() if r.status_code == 200 else {}
            current_q = last.get("nextQuestion")
            if r.status_code != 200:
                break
        record(
            "Submit answers (full loop)",
            "POST",
            "/api/v1/interviews/{id}/answer",
            r.status_code,
            answered == total and last.get("isComplete") is True,
            f"answered={answered}/{total} complete={last.get('isComplete')}",
        )

        r = await client.post(
            f"/api/v1/interviews/{session_id}/answer",
            headers=headers,
            json={"questionId": question.get("id", ""), "answer": "again"},
        )
        record("409 on finished session", "POST", "/api/v1/interviews/{id}/answer", r.status_code, r.status_code == 409)

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

        r = await client.get(f"/api/v1/interviews/{session_id}/session", headers=headers)
        detail = r.json() if r.status_code == 200 else {}
        record(
            "Session detail (resume UI)",
            "GET",
            "/api/v1/interviews/{id}/session",
            r.status_code,
            r.status_code == 200 and len(detail.get("questions", [])) == total,
            f"questions={len(detail.get('questions', []))}",
        )

        r = await client.get(
            "/api/v1/interviews/00000000-0000-0000-0000-000000000000/result", headers=headers
        )
        record("404 unknown session", "GET", "/api/v1/interviews/{id}/result", r.status_code, r.status_code == 404)

        # --- Module 2: AI Career Assistant --------------------------
        r = await client.post(
            "/api/v1/assistant/chat",
            headers=headers,
            json={"message": "Which upcoming drives am I eligible for and why?", "studentId": student_id},
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
            json={"question": "What gaps does my resume have?", "studentId": student_id},
        )
        record("Resume Q&A", "POST", "/api/v1/assistant/resume-qa", r.status_code, r.status_code == 200)

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

        r = await client.get(f"/api/v1/assistant/resume-status/{student_id}", headers=headers)
        status_body = r.json() if r.status_code == 200 else {}
        record(
            "Resume status",
            "GET",
            "/api/v1/assistant/resume-status/{student_id}",
            r.status_code,
            r.status_code == 200 and status_body.get("hasResume") is True,
            f"status={status_body.get('status')}",
        )

        # --- Streaming (Server-Sent Events) -------------------------
        frames: list[str] = []
        stream_status = 0
        async with client.stream(
            "POST",
            "/api/v1/assistant/chat/stream",
            headers=headers,
            json={"message": "Summarise which drives I am eligible for.", "studentId": student_id},
        ) as resp:
            stream_status = resp.status_code
            async for piece in resp.aiter_text():
                frames.append(piece)
        body = "".join(frames)
        record(
            "Streaming chat (SSE)",
            "POST",
            "/api/v1/assistant/chat/stream",
            stream_status,
            stream_status == 200 and "event: token" in body and "event: done" in body,
            f"chunks={len(frames)}",
        )

        # --- RBAC ---------------------------------------------------
        r = await client.get(
            "/api/v1/assistant/guidance/11111111-1111-1111-1111-111111111111", headers=headers
        )
        record("403 student→other student", "GET", "/api/v1/assistant/guidance/{other}", r.status_code, r.status_code == 403)

        # A Placement Officer may act on behalf of a student.
        r = await client.post("/api/v1/auth/dev-login", json={"email": DEMO_OFFICER_EMAIL})
        officer_headers = {}
        if r.status_code == 200:
            officer_headers = {"Authorization": f"Bearer {r.json().get('accessToken', '')}"}
        r = await client.get(f"/api/v1/assistant/guidance/{student_id}", headers=officer_headers)
        record(
            "Officer→student allowed (RBAC)",
            "GET",
            "/api/v1/assistant/guidance/{student_id}",
            r.status_code,
            r.status_code == 200,
        )

    passed = sum(1 for item in RESULTS if item["passed"])
    total = len(RESULTS)
    out = pathlib.Path(__file__).resolve().parents[1] / "_verify_live.json"
    out.write_text(
        json.dumps({"passed": passed, "total": total, "base_url": base_url, "results": RESULTS}, indent=2),
        encoding="utf-8",
    )
    print(f"\nRESULT: {passed}/{total} live checks passed. Report: {out}")
    return 0 if passed == total else 1


if __name__ == "__main__":
    base = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BASE_URL
    raise SystemExit(asyncio.run(run(base)))
