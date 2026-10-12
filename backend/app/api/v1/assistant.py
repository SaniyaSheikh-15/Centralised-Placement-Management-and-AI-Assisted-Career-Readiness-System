"""Module 2 endpoints - AI Career Assistant (PRD §3.4).

Routes
------
* ``POST /assistant/chat``                    - grounded career Q&A (RAG)
* ``POST /assistant/chat/stream``             - the same answer, streamed via SSE
* ``POST /assistant/resume-qa``               - questions about the parsed resume
* ``GET  /assistant/guidance/{student_id}``   - personalised roadmap / skill-gap
* ``GET  /assistant/resume-status/{student_id}`` - parsed resume availability

All routes require a valid JWT and enforce student-scoped access.
"""

from __future__ import annotations

import json
import uuid
from collections.abc import AsyncIterator

from fastapi import APIRouter, status
from fastapi.responses import StreamingResponse

from app.api.deps import CurrentIdentity, DbSession, resolve_student_id
from app.core.exceptions import AppError
from app.schemas.assistant import (
    ChatRequest,
    ChatResponse,
    GuidanceResponse,
    ResumeQARequest,
    ResumeQAResponse,
    ResumeStatusResponse,
)
from app.services import assistant_service


def _sse(event: str, data: dict[str, object]) -> str:
    """Format one Server-Sent Event frame."""
    return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"

router = APIRouter(prefix="/assistant", tags=["AI Career Assistant"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask the career assistant a grounded question",
)
async def chat(
    payload: ChatRequest, db: DbSession, identity: CurrentIdentity
) -> ChatResponse:
    """Answer a career question grounded in the student's real profile + drives."""
    student_id = await resolve_student_id(identity, payload.student_id)
    response = await assistant_service.chat(
        db,
        student_id=student_id,
        message=payload.message,
        conversation_id=payload.conversation_id,
    )
    await db.commit()
    return response


@router.post(
    "/resume-qa",
    response_model=ResumeQAResponse,
    status_code=status.HTTP_200_OK,
    summary="Ask a question about your parsed resume",
)
async def resume_qa(
    payload: ResumeQARequest, db: DbSession, identity: CurrentIdentity
) -> ResumeQAResponse:
    """Answer a resume-specific question using parsed-resume data only."""
    student_id = await resolve_student_id(identity, payload.student_id)
    response = await assistant_service.resume_qa(
        db, student_id=student_id, question=payload.question
    )
    await db.commit()
    return response


@router.get(
    "/guidance/{student_id}",
    response_model=GuidanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch a personalised career roadmap / skill-gap report",
)
async def guidance(
    student_id: uuid.UUID, db: DbSession, identity: CurrentIdentity
) -> GuidanceResponse:
    """Return a grounded roadmap for the student's target role."""
    resolved = await resolve_student_id(identity, student_id)
    response = await assistant_service.guidance(db, student_id=resolved)
    await db.commit()
    return response


@router.post(
    "/chat/stream",
    summary="Stream a grounded career answer (Server-Sent Events)",
    response_class=StreamingResponse,
)
async def chat_stream(
    payload: ChatRequest, db: DbSession, identity: CurrentIdentity
) -> StreamingResponse:
    """Stream the answer token-by-token via SSE.

    The PRD asks for streaming "if generation takes >3 seconds"; this endpoint
    provides it. Frames are:

    * ``event: meta``  - ``{"conversationId", "groundedOn"}``
    * ``event: token`` - ``{"text"}``, repeated
    * ``event: done``  - ``{"conversationId", "reply", "createdAt"}``
    * ``event: error`` - ``{"code", "message"}`` on failure
    """
    student_id = await resolve_student_id(identity, payload.student_id)
    conversation_id = payload.conversation_id or str(uuid.uuid4())

    async def event_source() -> AsyncIterator[str]:
        try:
            async for event, data in assistant_service.stream_chat(
                db, student_id=student_id, message=payload.message
            ):
                yield _sse(event, {**data, "conversationId": conversation_id})
            # Persist the completed turn once the stream has been fully sent.
            await db.commit()
        except AppError as exc:
            await db.rollback()
            yield _sse("error", {"code": exc.code, "message": exc.message})

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get(
    "/resume-status/{student_id}",
    response_model=ResumeStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Report whether the student's parsed resume is available",
)
async def resume_status(
    student_id: uuid.UUID, db: DbSession, identity: CurrentIdentity
) -> ResumeStatusResponse:
    """Return the resume availability/analysis state for the Resume-Q&A UI."""
    resolved = await resolve_student_id(identity, student_id)
    return await assistant_service.resume_status(db, student_id=resolved)
