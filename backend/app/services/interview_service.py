"""Module 1 service - AI Mock Interview.

Owns the session lifecycle and the question/answer loop:

1. ``start_session``    - create the session and generate question 1.
2. ``submit_answer``    - evaluate the answer, persist scores, generate the
                          next question (or finish the session).
3. ``get_result``       - assemble the final report from persisted rows.
4. ``get_history``      - list a student's past sessions.

Every step follows the PRD data flow: role-specific question → answer → AI
evaluation on the six dimensions → iterate → summary stored in
``mock_interviews``.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.core.logging_config import get_logger
from app.db.base import as_utc
from app.db.models import (
    InterviewQuestion,
    InterviewSession,
    JobRole,
    MockInterview,
    Project,
    Skill,
    StudentProfile,
    StudentSkill,
)
from app.prompts import (
    build_evaluation_prompt,
    build_question_prompt,
    build_summary_prompt,
)
from app.schemas.interview import (
    AnswerEvaluation,
    EvaluationResult,
    GeneratedQuestion,
    InterviewHistoryItem,
    InterviewHistoryResponse,
    InterviewQuestionOut,
    InterviewResultResponse,
    ScoreBreakdown,
    SessionDetailResponse,
    SessionSummaryResult,
)
from app.services.ai import AITask, get_ai_provider
from app.services.ai.json_utils import parse_model

logger = get_logger(__name__)

# Session lifecycle states.
STATUS_PENDING = "PENDING"
STATUS_IN_PROGRESS = "IN_PROGRESS"
STATUS_COMPLETED = "COMPLETED"


# ----------------------------------------------------------------------
# Candidate context (light retrieval for question personalisation)
# ----------------------------------------------------------------------
async def _build_candidate_context(
    db: AsyncSession, student_id: uuid.UUID, role_title: str
) -> dict[str, Any]:
    """Build a compact candidate snapshot used to personalise questions.

    Kept lighter than the full RAG context: only what helps the interviewer ask
    relevant questions (skills, projects, academic standing).
    """
    profile = await db.get(StudentProfile, student_id)
    skills = (
        await db.execute(
            select(Skill.skill_name, StudentSkill.proficiency_level)
            .join(StudentSkill, StudentSkill.skill_id == Skill.skill_id)
            .where(StudentSkill.student_id == student_id)
        )
    ).all()
    projects = (
        await db.execute(
            select(Project.title, Project.description).where(Project.student_id == student_id)
        )
    ).all()

    return {
        "target_role": role_title,
        "cgpa": float(profile.cgpa) if profile and profile.cgpa is not None else None,
        "graduation_year": profile.graduation_year if profile else None,
        "skills": [{"skill": s, "proficiency": p} for s, p in skills],
        "projects": [{"title": t, "description": d} for t, d in projects],
    }


async def _next_previous_questions(
    db: AsyncSession, session_id: uuid.UUID
) -> list[str]:
    """Return the questions already asked in this session (for anti-repetition)."""
    rows = (
        await db.execute(
            select(InterviewQuestion.question_text)
            .where(InterviewQuestion.session_id == session_id)
            .order_by(InterviewQuestion.question_number)
        )
    ).scalars().all()
    return list(rows)


async def _generate_question(
    db: AsyncSession,
    session: InterviewSession,
    question_number: int,
    candidate_context: dict[str, Any],
) -> InterviewQuestion:
    """Generate and persist the next interview question."""
    provider = get_ai_provider()
    previous = await _next_previous_questions(db, session.session_id)
    system, prompt = build_question_prompt(
        role=session.role_title,
        difficulty=session.difficulty,
        interview_type=session.interview_type,
        question_number=question_number,
        total_questions=session.total_questions,
        student_context=candidate_context,
        previous_questions=previous,
    )
    raw = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.QUESTION_GENERATION, as_json=True
    )
    generated = parse_model(
        raw,
        GeneratedQuestion,
        # Fallback keeps the session usable even if the model misbehaves.
        default=GeneratedQuestion(question_text=f"Tell me about your experience relevant to {session.role_title}."),
    )

    question = InterviewQuestion(
        session_id=session.session_id,
        question_number=question_number,
        question_text=generated.question_text,
        category=generated.category,
        ai_suggested_answer=generated.ai_suggested_answer,
    )
    db.add(question)
    await db.flush()
    return question


async def start_session(
    db: AsyncSession,
    *,
    student_id: uuid.UUID,
    role_title: str,
    difficulty: str,
    interview_type: str,
    total_questions: int,
) -> tuple[InterviewSession, InterviewQuestion]:
    """Create a session and generate the first question."""
    # Best-effort link to a canonical job role row (non-fatal if absent).
    job_role = (
        await db.execute(select(JobRole).where(JobRole.role_title.ilike(role_title)))
    ).scalars().first()

    session = InterviewSession(
        student_id=student_id,
        job_role_id=job_role.job_role_id if job_role else None,
        role_title=role_title,
        difficulty=difficulty,
        interview_type=interview_type,
        total_questions=total_questions,
        status=STATUS_IN_PROGRESS,
    )
    db.add(session)
    await db.flush()

    candidate_context = await _build_candidate_context(db, student_id, role_title)
    question = await _generate_question(db, session, 1, candidate_context)

    logger.info(
        "Interview session %s started for student %s (%s, %s)",
        session.session_id, student_id, role_title, difficulty,
    )
    return session, question


# ----------------------------------------------------------------------
# Answer submission + evaluation
# ----------------------------------------------------------------------
async def _evaluate_answer(
    session: InterviewSession, question: InterviewQuestion, answer: str
) -> EvaluationResult:
    """Call the AI to score one answer across the six PRD dimensions."""
    provider = get_ai_provider()
    system, prompt = build_evaluation_prompt(
        role=session.role_title,
        difficulty=session.difficulty,
        interview_type=session.interview_type,
        question_text=question.question_text,
        answer=answer,
    )
    raw = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.ANSWER_EVALUATION, as_json=True
    )
    return parse_model(
        raw,
        EvaluationResult,
        default=EvaluationResult(
            relevance=60, completeness=60, technical=60,
            communication=60, fluency=60, grammar=60,
            feedback="Automatic fallback evaluation (AI response could not be parsed).",
        ),
    )


def _overall(evaluation: EvaluationResult) -> float:
    """Mean of the six evaluation dimensions, rounded to 2 dp."""
    values = [
        evaluation.relevance,
        evaluation.completeness,
        evaluation.technical,
        evaluation.communication,
        evaluation.fluency,
        evaluation.grammar,
    ]
    return round(sum(values) / len(values), 2)


class AnswerOutcome:
    """Result of submitting an answer (returned to the router)."""

    def __init__(
        self,
        *,
        session: InterviewSession,
        evaluation: AnswerEvaluation,
        is_complete: bool,
        next_question: InterviewQuestion | None,
    ) -> None:
        self.session = session
        self.evaluation = evaluation
        self.is_complete = is_complete
        self.next_question = next_question


async def submit_answer(
    db: AsyncSession,
    *,
    session_id: uuid.UUID,
    question_id: uuid.UUID,
    answer: str,
) -> AnswerOutcome:
    """Evaluate an answer, persist it, and advance the session."""
    session = await db.get(InterviewSession, session_id)
    if session is None:
        raise NotFoundError("Interview session not found.")
    if session.status == STATUS_COMPLETED:
        raise ConflictError("This interview session is already complete.")

    question = await db.get(InterviewQuestion, question_id)
    if question is None or question.session_id != session_id:
        raise NotFoundError("Question not found in this session.")
    if question.user_answer is not None:
        raise ConflictError("This question has already been answered.")

    evaluation = await _evaluate_answer(session, question, answer)
    overall = _overall(evaluation)

    # Persist the answer and its six-dimension evaluation.
    question.user_answer = answer
    question.relevance_score = evaluation.relevance
    question.completeness_score = evaluation.completeness
    question.technical_score = evaluation.technical
    question.communication_score = evaluation.communication
    question.fluency_score = evaluation.fluency
    question.grammar_score = evaluation.grammar
    question.overall_score = overall
    question.feedback = evaluation.feedback
    question.answered_at = datetime.now(timezone.utc)

    session.answered_questions = (session.answered_questions or 0) + 1

    is_complete = session.answered_questions >= session.total_questions
    next_question: InterviewQuestion | None = None
    if is_complete:
        await complete_session(db, session)
    else:
        candidate_context = await _build_candidate_context(
            db, session.student_id, session.role_title
        )
        next_question = await _generate_question(
            db, session, session.answered_questions + 1, candidate_context
        )

    await db.flush()

    return AnswerOutcome(
        session=session,
        evaluation=AnswerEvaluation(
            relevance=evaluation.relevance,
            completeness=evaluation.completeness,
            technical=evaluation.technical,
            communication=evaluation.communication,
            fluency=evaluation.fluency,
            grammar=evaluation.grammar,
            overall=overall,
            feedback=evaluation.feedback,
        ),
        is_complete=is_complete,
        next_question=next_question,
    )


# ----------------------------------------------------------------------
# Completion + aggregation
# ----------------------------------------------------------------------
async def _all_questions(db: AsyncSession, session_id: uuid.UUID) -> list[InterviewQuestion]:
    """Return every question of a session ordered by number."""
    return list(
        (
            await db.execute(
                select(InterviewQuestion)
                .where(InterviewQuestion.session_id == session_id)
                .order_by(InterviewQuestion.question_number)
            )
        ).scalars().all()
    )


def _aggregate(questions: list[InterviewQuestion]) -> dict[str, float]:
    """Aggregate per-question scores into session-level dimension averages."""
    answered = [q for q in questions if q.overall_score is not None]
    if not answered:
        return {"technical": 0.0, "communication": 0.0, "confidence": 0.0,
                "relevance": 0.0, "grammar": 0.0, "fluency": 0.0, "overall": 0.0}

    def mean(attr: str) -> float:
        vals = [float(getattr(q, attr)) for q in answered if getattr(q, attr) is not None]
        return round(sum(vals) / len(vals), 2) if vals else 0.0

    technical = mean("technical_score")
    communication = mean("communication_score")
    fluency = mean("fluency_score")
    grammar = mean("grammar_score")
    relevance = mean("relevance_score")
    overall = mean("overall_score")
    # "Confidence" is a derived signal from communication + fluency.
    confidence = round((communication + fluency) / 2, 2)
    return {
        "technical": technical,
        "communication": communication,
        "confidence": confidence,
        "relevance": relevance,
        "grammar": grammar,
        "fluency": fluency,
        "overall": overall,
    }


async def complete_session(db: AsyncSession, session: InterviewSession) -> None:
    """Finalise a session: generate the summary and write ``mock_interviews``."""
    if session.status == STATUS_COMPLETED:
        return

    questions = await _all_questions(db, session.session_id)
    aggregates = _aggregate(questions)

    # Ask the AI for the narrative summary (strengths/improvements).
    provider = get_ai_provider()
    per_question = [
        {
            "question": q.question_text,
            "score": float(q.overall_score) if q.overall_score is not None else None,
            "feedback": q.feedback,
        }
        for q in questions
    ]
    system, prompt = build_summary_prompt(
        role=session.role_title,
        difficulty=session.difficulty,
        interview_type=session.interview_type,
        per_question=per_question,
    )
    raw = await provider.generate_text(
        prompt=prompt, system_instruction=system, task=AITask.SESSION_SUMMARY, as_json=True
    )
    summary = parse_model(
        raw,
        SessionSummaryResult,
        default=SessionSummaryResult(
            strengths=["Completed the interview"],
            improvements=["Practise more structured answers"],
            summary="Automatic fallback summary.",
        ),
    )

    now = datetime.now(timezone.utc)

    # Persist aggregates + narrative on the session (drives result/history).
    session.overall_score = aggregates["overall"]
    session.technical_score = aggregates["technical"]
    session.communication_score = aggregates["communication"]
    session.confidence_score = aggregates["confidence"]
    session.relevance_score = aggregates["relevance"]
    session.summary = summary.summary
    session.strengths_json = json.dumps(summary.strengths)
    session.improvements_json = json.dumps(summary.improvements)
    session.status = STATUS_COMPLETED
    session.completed_at = now

    # PRD requirement: store the aggregated result in ``mock_interviews``.
    # ``as_utc`` normalises the value because SQLite returns naive datetimes.
    started = as_utc(session.created_at) or now
    duration_minutes = max(1, int((now - started).total_seconds() // 60))
    db.add(
        MockInterview(
            student_id=session.student_id,
            job_role_id=session.job_role_id,
            grammar_score=aggregates["grammar"],
            fluency_score=aggregates["fluency"],
            confidence_score=aggregates["confidence"],
            technical_score=aggregates["technical"],
            overall_score=aggregates["overall"],
            ai_feedback=summary.summary or "",
            duration_minutes=duration_minutes,
            completed_at=now,
        )
    )
    await db.flush()

    logger.info(
        "Interview session %s completed. Overall=%.2f", session.session_id, aggregates["overall"]
    )


# ----------------------------------------------------------------------
# Output builders
# ----------------------------------------------------------------------
def question_to_schema(question: InterviewQuestion) -> InterviewQuestionOut:
    """Map an ORM question to its API representation."""
    return InterviewQuestionOut(
        id=str(question.question_id),
        question_number=question.question_number,
        question_text=question.question_text,
        category=question.category or "Technical",
        user_answer=question.user_answer,
        ai_suggested_answer=question.ai_suggested_answer,
        feedback=question.feedback,
        score=float(question.overall_score) if question.overall_score is not None else None,
    )


def _loads_list(raw: str | None) -> list[str]:
    """Decode a JSON list column, tolerating null/garbage."""
    if not raw:
        return []
    try:
        value = json.loads(raw)
        return value if isinstance(value, list) else []
    except json.JSONDecodeError:
        return []


async def get_result(db: AsyncSession, session_id: uuid.UUID) -> InterviewResultResponse:
    """Assemble the final report for a session, completing it if necessary."""
    session = await db.get(InterviewSession, session_id)
    if session is None:
        raise NotFoundError("Interview session not found.")

    # Fetching the result of an unfinished session finalises it (PRD-friendly).
    if session.status != STATUS_COMPLETED:
        await complete_session(db, session)
        await db.flush()

    questions = await _all_questions(db, session.session_id)
    strengths = _loads_list(session.strengths_json)
    improvements = _loads_list(session.improvements_json)

    return InterviewResultResponse(
        interview_id=str(session.session_id),
        role=session.role_title,
        date=(as_utc(session.completed_at) or as_utc(session.created_at)).isoformat(),
        difficulty=session.difficulty,  # type: ignore[arg-type]
        overall_score=float(session.overall_score or 0.0),
        score_breakdown=ScoreBreakdown(
            technical=float(session.technical_score or 0.0),
            communication=float(session.communication_score or 0.0),
            confidence=float(session.confidence_score or 0.0),
            relevance=float(session.relevance_score or 0.0),
        ),
        strengths=strengths,
        improvements=improvements,
        questions=[question_to_schema(q) for q in questions],
    )


async def get_session_detail(
    db: AsyncSession, session_id: uuid.UUID
) -> SessionDetailResponse:
    """Return the full state of a session so the UI can resume it."""
    session = await db.get(InterviewSession, session_id)
    if session is None:
        raise NotFoundError("Interview session not found.")

    questions = await _all_questions(db, session.session_id)
    # The "current" question is the first one still awaiting an answer.
    pending = next((q for q in questions if q.user_answer is None), None)

    return SessionDetailResponse(
        session_id=str(session.session_id),
        role=session.role_title,
        difficulty=session.difficulty,  # type: ignore[arg-type]
        type=session.interview_type,  # type: ignore[arg-type]
        status=session.status,
        total_questions=session.total_questions,
        answered_questions=session.answered_questions or 0,
        created_at=(as_utc(session.created_at) or datetime.now(timezone.utc)).isoformat(),
        questions=[question_to_schema(q) for q in questions],
        current_question=question_to_schema(pending) if pending else None,
    )


async def get_history(
    db: AsyncSession, student_id: uuid.UUID, limit: int = 50
) -> InterviewHistoryResponse:
    """Return a student's interview history (most recent first)."""
    sessions = (
        await db.execute(
            select(InterviewSession)
            .where(InterviewSession.student_id == student_id)
            .order_by(InterviewSession.created_at.desc())
            .limit(limit)
        )
    ).scalars().all()

    items = [
        InterviewHistoryItem(
            session_id=str(s.session_id),
            date=(as_utc(s.completed_at) or as_utc(s.created_at)).date().isoformat(),
            role=s.role_title,
            difficulty=s.difficulty,  # type: ignore[arg-type]
            overall_score=float(s.overall_score or 0.0),
            technical=float(s.technical_score or 0.0),
            communication=float(s.communication_score or 0.0),
        )
        for s in sessions
    ]
    return InterviewHistoryResponse(
        student_id=str(student_id),
        sessions=items,
        total_sessions=len(items),
    )
