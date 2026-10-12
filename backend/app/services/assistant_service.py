"""Module 2 service - AI Career Assistant.

Implements the PRD data flow for the assistant:

1. Receive the student's query.
2. Retrieve a structured RAG context (see ``context_service``).
3. Ask the grounded model for an answer (strict system prompt; hallucination
   mitigation).
4. Persist the turn in ``career_chat``.
5. Return the answer plus the provenance of the context used.

Also provides resume-Q&A and the pre-generated guidance/roadmap endpoint.
"""

from __future__ import annotations

import uuid
from collections.abc import AsyncIterator
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.logging_config import get_logger
from app.db.base import as_utc
from app.db.models import (
    CareerChat,
    Resume,
    ResumeAnalysis,
    SkillGapReport,
    StudentProfile,
)
from app.prompts import (
    build_chat_prompt,
    build_guidance_prompt,
    build_resume_qa_prompt,
)
from app.schemas.assistant import (
    ChatAnswerResult,
    ChatResponse,
    GroundingSource,
    GuidanceResponse,
    GuidanceResult,
    ResumeQAResponse,
    ResumeStatusResponse,
)
from app.services import context_service
from app.services.ai import AITask, get_ai_provider
from app.services.ai.json_utils import parse_model

logger = get_logger(__name__)

# The system prompt already instructs the model to flag insufficient context;
# this message is used when the model explicitly reports it.
_INSUFFICIENT_CONTEXT_MESSAGE = (
    "I don't have enough information in your profile or the current drives to "
    "answer that reliably. Please make sure your profile, skills and resume are "
    "up to date, then ask again."
)


async def _ensure_student_exists(db: AsyncSession, student_id: uuid.UUID) -> None:
    """Raise ``NotFoundError`` when the student profile does not exist."""
    exists = (
        await db.execute(
            select(StudentProfile.student_id).where(StudentProfile.student_id == student_id)
        )
    ).scalars().first()
    if not exists:
        raise NotFoundError("Student profile not found.")


async def chat(
    db: AsyncSession,
    *,
    student_id: uuid.UUID,
    message: str,
    conversation_id: str | None = None,
) -> ChatResponse:
    """Answer a career question grounded in the student's real data."""
    await _ensure_student_exists(db, student_id)

    context, sources = await context_service.build_rag_context(db, student_id)

    provider = get_ai_provider()
    system, prompt = build_chat_prompt(question=message, context=context)
    raw = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.CAREER_CHAT, as_json=True
    )
    result = parse_model(
        raw,
        ChatAnswerResult,
        default=ChatAnswerResult(answer=raw, insufficient_context=False),
    )

    reply = _INSUFFICIENT_CONTEXT_MESSAGE if result.insufficient_context else result.answer
    created_at = datetime.now(timezone.utc)

    # Persist the turn (question + answer) in ``career_chat``.
    db.add(CareerChat(student_id=student_id, question=message, answer=reply, created_at=created_at))
    await db.flush()

    logger.info("Career chat answered for student %s (%s sources)", student_id, len(sources))
    return ChatResponse(
        conversation_id=conversation_id or str(uuid.uuid4()),
        reply=reply,
        created_at=created_at.isoformat(),
        grounded_on=[GroundingSource(**s) for s in sources],
    )


async def stream_chat(
    db: AsyncSession, *, student_id: uuid.UUID, message: str
) -> AsyncIterator[tuple[str, dict[str, Any]]]:
    """Stream a grounded chat answer as ``(event, payload)`` tuples.

    Events emitted, in order:

    * ``meta``  - the RAG provenance (``groundedOn``) so the UI can show sources.
    * ``token`` - an incremental text chunk (``text``).
    * ``done``  - the turn is persisted; carries ``createdAt`` and the full text.

    Persistence happens once the stream completes, so a dropped connection
    cannot leave a half-written ``career_chat`` row. The caller owns the
    transaction (it commits after the stream is exhausted).
    """
    await _ensure_student_exists(db, student_id)

    context, sources = await context_service.build_rag_context(db, student_id)
    yield ("meta", {"groundedOn": sources})

    provider = get_ai_provider()
    system, prompt = build_chat_prompt(question=message, context=context)

    collected: list[str] = []
    async for chunk in provider.stream_text(
        prompt=prompt, system_instruction=system, task=AITask.CAREER_CHAT
    ):
        collected.append(chunk)
        yield ("token", {"text": chunk})

    answer = "".join(collected).strip()
    created_at = datetime.now(timezone.utc)
    db.add(
        CareerChat(student_id=student_id, question=message, answer=answer, created_at=created_at)
    )
    await db.flush()

    logger.info("Career chat streamed for student %s (%s sources)", student_id, len(sources))
    yield ("done", {"createdAt": created_at.isoformat(), "reply": answer})


async def resume_qa(
    db: AsyncSession, *, student_id: uuid.UUID, question: str
) -> ResumeQAResponse:
    """Answer a question about the student's resume using parsed-resume data."""
    await _ensure_student_exists(db, student_id)

    summary, has_resume = await context_service.build_resume_summary(db, student_id)
    provider = get_ai_provider()
    system, prompt = build_resume_qa_prompt(
        question=question, has_resume=has_resume, resume_summary=summary
    )
    answer = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.RESUME_QA, as_json=False
    )

    # Persist resume-Q&A turns too, so the assistant has a full chat history.
    db.add(
        CareerChat(
            student_id=student_id,
            question=f"[resume-qa] {question}",
            answer=answer,
            created_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()

    return ResumeQAResponse(answer=answer, references_resume=has_resume)


async def resume_status(
    db: AsyncSession, *, student_id: uuid.UUID
) -> ResumeStatusResponse:
    """Report whether the student has a parsed resume, and its analysis state."""
    await _ensure_student_exists(db, student_id)

    resume = (
        await db.execute(
            select(Resume)
            .where(Resume.student_id == student_id)
            .order_by(Resume.is_default.desc(), Resume.version.desc())
            .limit(1)
        )
    ).scalars().first()
    if resume is None:
        return ResumeStatusResponse(has_resume=False)

    analysis = (
        await db.execute(
            select(ResumeAnalysis)
            .where(ResumeAnalysis.resume_id == resume.resume_id)
            .order_by(ResumeAnalysis.analyzed_at.desc())
            .limit(1)
        )
    ).scalars().first()

    uploaded_at = as_utc(resume.uploaded_at)
    return ResumeStatusResponse(
        has_resume=True,
        file_name=resume.resume_file_name,
        uploaded_at=uploaded_at.isoformat() if uploaded_at else None,
        # ANALYZED means a ``resume_analysis`` row exists for this resume.
        status="ANALYZED" if analysis else "UPLOADED",
    )


async def guidance(db: AsyncSession, *, student_id: uuid.UUID) -> GuidanceResponse:
    """Return a personalised career roadmap / skill-gap report.

    The roadmap is generated (grounded) and then cached in ``skill_gap_reports``
    so subsequent calls are cheap and the report survives across sessions.
    """
    await _ensure_student_exists(db, student_id)

    job_role_id, target_role = await context_service.resolve_target_role(db, student_id)
    context, sources = await context_service.build_rag_context(db, student_id)

    provider = get_ai_provider()
    system, prompt = build_guidance_prompt(target_role=target_role, context=context)
    raw = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.GUIDANCE, as_json=True
    )
    result = parse_model(raw, GuidanceResult, default=GuidanceResult(recommended_role=target_role))

    # Persist the report (skill_gap_reports) for future reads.
    missing = ", ".join(result.skills_to_learn)
    courses = ", ".join(result.certifications)
    db.add(
        SkillGapReport(
            student_id=student_id,
            target_job_role_id=job_role_id,
            missing_skills=missing or None,
            recommended_courses=courses or None,
            generated_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()

    reasoning = result.reasoning or (
        f"Based on your profile, the recommended focus is the {target_role} track."
    )
    return GuidanceResponse(
        recommended_role=result.recommended_role or target_role,
        reasoning=reasoning,
        skills_to_learn=result.skills_to_learn,
        projects_to_build=result.projects_to_build,
        certifications=result.certifications,
        roadmap=sorted(result.roadmap, key=lambda step: step.order),
        grounded_on=[GroundingSource(**s) for s in sources],
    )
