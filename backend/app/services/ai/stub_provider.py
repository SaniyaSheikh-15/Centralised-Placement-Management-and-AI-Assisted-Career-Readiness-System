"""Deterministic offline AI provider.

Used when no ``GEMINI_API_KEY`` is configured (``AI_PROVIDER=auto|stub``) or in
the test suite. It returns **schema-valid** JSON for every :class:`AITask` so the
entire API - question generation, evaluation, summary, RAG chat and guidance -
can be exercised end-to-end via Swagger without any external network call.

The stub is deliberately *context aware*: it reads the machine-readable hint
lines embedded in each prompt (``ROLE:``, ``QUESTION_NUMBER:`` etc.) so its
output still reflects the request, which keeps integration testing meaningful.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import re
from collections.abc import AsyncIterator

from app.services.ai.base import AIProvider, AITask


# ----------------------------------------------------------------------
# Prompt-hint extraction helpers
# ----------------------------------------------------------------------
def _hint(prompt: str, key: str, default: str = "") -> str:
    """Return the value of a ``KEY: value`` hint line, else ``default``."""
    match = re.search(rf"^{re.escape(key)}:\s*(.+)$", prompt, re.MULTILINE)
    return match.group(1).strip() if match else default


def _block(prompt: str, start: str, end: str, default: str = "") -> str:
    """Return the text between two markers (used to extract the answer)."""
    match = re.search(rf"{re.escape(start)}(.*?){re.escape(end)}", prompt, re.DOTALL)
    return match.group(1).strip() if match else default


def _stable_score(seed: str, low: int, high: int) -> float:
    """Map ``seed`` to a stable score in ``[low, high]`` (deterministic)."""
    digest = int(hashlib.sha256(seed.encode("utf-8")).hexdigest(), 16)
    return float(low + (digest % (high - low + 1)))


# ----------------------------------------------------------------------
# Provider
# ----------------------------------------------------------------------
class StubProvider(AIProvider):
    """A deterministic, dependency-free AI provider for offline operation."""

    name = "stub"

    # A small question bank keyed by category so output still reads naturally.
    _QUESTION_BANK: dict[str, list[tuple[str, str]]] = {
        "Technical": [
            (
                "Explain how you would design a REST API for a {role}, covering auth and versioning.",
                "Use JWT/OAuth2 for auth, version via /v1 URL or Accept header, paginate lists, and document with OpenAPI.",
            ),
            (
                "What are the key trade-offs when optimising database queries for {role} workloads?",
                "Indexing, query plans, denormalisation vs normalisation, caching, and connection pooling.",
            ),
            (
                "How do you ensure code quality and testing in {role} projects?",
                "Unit/integration tests, linting, code review, CI gates, and coverage thresholds.",
            ),
        ],
        "Behavioral": [
            (
                "Describe a time you handled a difficult deadline as a {role}. (Use STAR.)",
                "Situation, Task, Action, Result - emphasise prioritisation and communication.",
            ),
            (
                "Tell me about a conflict with a teammate and how you resolved it as a {role}.",
                "Focus on empathy, objective criteria, and a constructive resolution.",
            ),
        ],
        "System Design": [
            (
                "Design a scalable system for a {role} that handles 10x traffic growth.",
                "Load balancing, horizontal scaling, caching, async processing, and observability.",
            ),
            (
                "How would you guarantee data consistency across services for a {role}?",
                "Idempotency, sagas, eventual consistency, and the transactional outbox pattern.",
            ),
        ],
    }

    async def generate_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        as_json: bool = False,
        temperature: float | None = None,
    ) -> str:
        """Dispatch to the per-task stub builder based on ``task``."""
        if task is AITask.QUESTION_GENERATION:
            return json.dumps(self._question(prompt))
        if task is AITask.ANSWER_EVALUATION:
            return json.dumps(self._evaluation(prompt))
        if task is AITask.SESSION_SUMMARY:
            return json.dumps(self._summary(prompt))
        if task is AITask.CAREER_CHAT:
            return json.dumps(self._chat(prompt))
        if task is AITask.RESUME_QA:
            return self._resume_qa(prompt)
        if task is AITask.GUIDANCE:
            return json.dumps(self._guidance(prompt))
        return json.dumps({"answer": "Offline stub response (no AI task specified)."})

    async def stream_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        temperature: float | None = None,
    ) -> AsyncIterator[str]:
        """Stream the stub answer word-by-word.

        This simulates token streaming so the SSE chat endpoint can be exercised
        (and its UI streaming state tested) without a real model. For chat the
        natural-language ``answer`` field is streamed rather than the raw JSON
        envelope the non-streaming path returns.
        """
        payload = await self.generate_text(
            prompt=prompt, system_instruction=system_instruction, task=task, temperature=temperature
        )
        text = payload
        if task is AITask.CAREER_CHAT:
            try:
                text = json.loads(payload).get("answer", payload)
            except json.JSONDecodeError:
                text = payload

        for index, word in enumerate(text.split(" ")):
            # ``sleep(0)`` hands control back to the event loop so chunks are
            # actually delivered incrementally by the ASGI server.
            await asyncio.sleep(0)
            yield word if index == 0 else " " + word

    # --- per-task builders -------------------------------------------
    def _question(self, prompt: str) -> dict[str, str]:
        role = _hint(prompt, "ROLE", "the target role")
        category = _hint(prompt, "INTERVIEW_TYPE", "Technical")
        number = int(_hint(prompt, "QUESTION_NUMBER", "1") or 1)
        if category == "Mixed":
            category = ["Technical", "Behavioral", "System Design"][(number - 1) % 3]
        bank = self._QUESTION_BANK.get(category) or self._QUESTION_BANK["Technical"]
        text, suggested = bank[(number - 1) % len(bank)]
        return {
            "questionText": text.format(role=role),
            "category": category,
            "aiSuggestedAnswer": suggested,
        }

    def _evaluation(self, prompt: str) -> dict[str, object]:
        answer = _block(prompt, "CANDIDATE_ANSWER:", "END_CANDIDATE_ANSWER:")
        words = len(answer.split())
        # Longer, keyword-rich answers score higher (mirrors a real grader).
        base = min(55 + words, 92)
        if any(k in answer.lower() for k in ("because", "example", "experience", "trade-off")):
            base = min(base + 5, 95)
        return {
            "relevance": _stable_score(answer + "r", int(base) - 4, int(base) + 4),
            "completeness": _stable_score(answer + "c", int(base) - 6, int(base) + 2),
            "technical": _stable_score(answer + "t", int(base) - 5, int(base) + 5),
            "communication": _stable_score(answer + "m", int(base) - 3, int(base) + 6),
            "fluency": _stable_score(answer + "f", int(base) - 2, int(base) + 7),
            "grammar": _stable_score(answer + "g", int(base) - 1, int(base) + 8),
            "feedback": (
                "Offline stub evaluation. The answer is structured and relevant; add more "
                "concrete examples and quantify impact to strengthen it."
                if words > 25
                else "Offline stub evaluation. The answer is brief - expand with specifics, "
                "examples and measurable outcomes."
            ),
        }

    def _summary(self, prompt: str) -> dict[str, object]:
        role = _hint(prompt, "ROLE", "the role")
        return {
            "strengths": [
                f"Shows working knowledge relevant to {role}",
                "Communicates ideas in a clear, structured way",
                "Handles conceptual questions with reasonable depth",
            ],
            "improvements": [
                "Add quantifiable results and metrics to answers",
                "Discuss edge cases and trade-offs earlier",
                "Use the STAR format for behavioural questions",
            ],
            "summary": f"Offline stub summary for a {role} interview. Keep practising structured answers.",
        }

    def _chat(self, prompt: str) -> dict[str, object]:
        question = _hint(prompt, "STUDENT_QUESTION", "")
        has_context = "STRUCTURED_CONTEXT_JSON:" in prompt
        if not has_context:
            return {
                "answer": (
                    "I don't yet have your profile or the current drives in my context, so I "
                    "can't give a grounded recommendation. Please try again once your profile "
                    "and drives are available."
                ),
                "insufficientContext": True,
            }
        return {
            "answer": (
                f"Offline stub answer to: '{question}'. Based on your retrieved profile and the "
                "currently open drives, focus on strengthening the missing skills listed in your "
                "skill-gap report and target the drives whose eligibility you meet. (This is "
                "deterministic offline output; configure GEMINI_API_KEY for real guidance.)"
            ),
            "insufficientContext": False,
        }

    def _resume_qa(self, prompt: str) -> str:
        if "RESUME_SUMMARY:" in prompt and _hint(prompt, "HAS_RESUME", "false") == "true":
            return (
                "Offline stub: your resume highlights your listed projects and skills. Align it "
                "to the target role by quantifying impact and mirroring the job's keywords."
            )
        return "Offline stub: no parsed resume data is available for this student yet."

    def _guidance(self, prompt: str) -> dict[str, object]:
        role = _hint(prompt, "TARGET_ROLE", "Software Engineer")
        return {
            "recommendedRole": role,
            "reasoning": (
                "Offline stub guidance derived from your profile's target role and skill gaps. "
                "Configure GEMINI_API_KEY for a fully personalised roadmap."
            ),
            "skillsToLearn": ["Docker", "REST API", "System Design", "Testing"],
            "projectsToBuild": [
                {
                    "title": "Full-Stack Portfolio API",
                    "description": "Build an authenticated REST API with tests and CI to demonstrate backend skills.",
                },
                {
                    "title": "Data Dashboard",
                    "description": "Create a dashboard visualising a public dataset to showcase analytics skills.",
                },
            ],
            "certifications": ["AWS Cloud Practitioner", "Meta Backend Developer"],
            "roadmap": [
                {"step": "Master core language + data structures", "order": 1},
                {"step": "Build and deploy 2 portfolio projects", "order": 2},
                {"step": "Practise mock interviews and DSA", "order": 3},
                {"step": "Apply to eligible drives and tailor your resume", "order": 4},
            ],
        }
