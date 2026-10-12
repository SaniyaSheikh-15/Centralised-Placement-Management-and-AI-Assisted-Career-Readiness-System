"""Module 1 endpoints - AI Mock Interview (PRD §2.3).

Routes
------
* ``POST /interviews/start``                  - start a session, get question 1
* ``POST /interviews/{session_id}/answer``    - submit an answer, get evaluation + next question
* ``GET  /interviews/{session_id}/result``    - fetch the final report
* ``GET  /interviews/{session_id}/session``   - fetch the live session state (resume a session)
* ``GET  /interviews/history``                - list past interviews for the caller

All routes require a valid JWT and enforce that a student only touches their own
sessions (``resolve_student_id`` + an ownership check on the session).
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Query, status

from app.api.deps import CurrentIdentity, DbSession, resolve_student_id
from app.core.exceptions import NotFoundError
from app.db.models import InterviewSession
from app.schemas.interview import (
    InterviewHistoryResponse,
    InterviewResultResponse,
    SessionDetailResponse,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from app.services import interview_service

router = APIRouter(prefix="/interviews", tags=["AI Mock Interview"])


async def _load_owned_session(
    db: DbSession, identity: CurrentIdentity, session_id: uuid.UUID
) -> InterviewSession:
    """Load a session and verify the caller may access it (RBAC)."""
    session = await db.get(InterviewSession, session_id)
    if session is None:
        raise NotFoundError("Interview session not found.")
    if not identity.is_privileged and session.student_id != identity.student_id:
        # Do not reveal the existence of other students' sessions.
        raise NotFoundError("Interview session not found.")
    return session


@router.post(
    "/start",
    response_model=StartInterviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a mock interview session",
)
async def start_interview(
    payload: StartInterviewRequest, db: DbSession, identity: CurrentIdentity
) -> StartInterviewResponse:
    """Create a session and return the first generated question."""
    student_id = await resolve_student_id(identity, payload.student_id)

    session, question = await interview_service.start_session(
        db,
        student_id=student_id,
        role_title=payload.role,
        difficulty=payload.difficulty.value,
        interview_type=payload.type.value,
        total_questions=payload.question_count,
    )
    await db.commit()

    return StartInterviewResponse(
        session_id=str(session.session_id),
        role=session.role_title,
        difficulty=session.difficulty,  # type: ignore[arg-type]
        type=session.interview_type,  # type: ignore[arg-type]
        total_questions=session.total_questions,
        first_question=interview_service.question_to_schema(question),
        created_at=session.created_at.isoformat(),
    )


@router.post(
    "/{session_id}/answer",
    response_model=SubmitAnswerResponse,
    summary="Submit an answer and receive evaluation + next question",
)
async def submit_answer(
    session_id: uuid.UUID,
    payload: SubmitAnswerRequest,
    db: DbSession,
    identity: CurrentIdentity,
) -> SubmitAnswerResponse:
    """Evaluate the answer; advance to the next question or finish the session."""
    await _load_owned_session(db, identity, session_id)

    try:
        question_id = uuid.UUID(payload.question_id)
    except ValueError as exc:
        raise NotFoundError("Question not found in this session.") from exc

    outcome = await interview_service.submit_answer(
        db, session_id=session_id, question_id=question_id, answer=payload.answer
    )
    await db.commit()

    return SubmitAnswerResponse(
        session_id=str(outcome.session.session_id),
        is_complete=outcome.is_complete,
        next_question=(
            interview_service.question_to_schema(outcome.next_question)
            if outcome.next_question
            else None
        ),
        question_number=outcome.session.answered_questions,
        total_questions=outcome.session.total_questions,
        evaluation=outcome.evaluation,
    )


@router.get(
    "/{session_id}/result",
    response_model=InterviewResultResponse,
    summary="Fetch the final interview report",
)
async def get_result(
    session_id: uuid.UUID, db: DbSession, identity: CurrentIdentity
) -> InterviewResultResponse:
    """Return the aggregated report (finalises the session if still open)."""
    await _load_owned_session(db, identity, session_id)
    result = await interview_service.get_result(db, session_id)
    await db.commit()
    return result


@router.get(
    "/{session_id}/session",
    response_model=SessionDetailResponse,
    summary="Fetch the current state of an interview session",
)
async def get_session(
    session_id: uuid.UUID, db: DbSession, identity: CurrentIdentity
) -> SessionDetailResponse:
    """Return the full session state so the UI can resume an interview."""
    await _load_owned_session(db, identity, session_id)
    return await interview_service.get_session_detail(db, session_id)


@router.get(
    "/history",
    response_model=InterviewHistoryResponse,
    summary="List the caller's past interviews",
)
async def get_history(
    db: DbSession,
    identity: CurrentIdentity,
    student_id: uuid.UUID | None = Query(
        default=None, description="Required only when acting on behalf of a student."
    ),
    limit: int = Query(default=50, ge=1, le=200),
) -> InterviewHistoryResponse:
    """Return interview history for the caller (or a specified student)."""
    resolved = await resolve_student_id(identity, student_id)
    return await interview_service.get_history(db, resolved, limit=limit)
