"""AI and interview tables.

Two categories live here:

1. **Frozen-schema AI tables** (already defined by the platform, written to by
   this service):
   ``resume_analysis``, ``skill_gap_reports``, ``mock_interviews``,
   ``career_chat``, ``notifications``.

2. **Backend-owned interview tables** (added by this FastAPI backend, because
   the frozen schema has *no* per-question storage yet):
   ``interview_sessions`` and ``interview_questions``.

   The PRD asks for "state management for the interview session (saving
   questions and evaluations to the DB)", so the multi-turn state lives in
   these two tables; the *final aggregated summary* is written to the frozen
   ``mock_interviews`` table as required by the PRD's data-flow step 7.

These extra tables are additive - they never modify the frozen schema and are
only created/queried inside the AI backend.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, utcnow


# ======================================================================
# Frozen-schema AI tables (read/write by this service)
# ======================================================================
class ResumeAnalysis(Base):
    """Parsed-resume analysis (``resume_analysis``) - ATS + job match."""

    __tablename__ = "resume_analysis"

    analysis_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    resume_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("resumes.resume_id"), nullable=False
    )
    job_role_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("job_roles.job_role_id")
    )
    ats_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    job_match_percentage: Mapped[float | None] = mapped_column(Numeric(5, 2))
    missing_keywords: Mapped[str | None] = mapped_column(Text)
    strengths: Mapped[str | None] = mapped_column(Text)
    weaknesses: Mapped[str | None] = mapped_column(Text)
    recommendations: Mapped[str | None] = mapped_column(Text)
    analyzed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class SkillGapReport(Base):
    """Pre-generated skill-gap report (``skill_gap_reports``)."""

    __tablename__ = "skill_gap_reports"

    report_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("student_profiles.student_id"), nullable=False
    )
    target_job_role_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("job_roles.job_role_id")
    )
    missing_skills: Mapped[str | None] = mapped_column(Text)
    recommended_courses: Mapped[str | None] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class MockInterview(Base):
    """Final aggregated mock-interview result (``mock_interviews``).

    Per the PRD this is written once at the end of a session with the aggregated
    dimension scores and free-text feedback.
    """

    __tablename__ = "mock_interviews"

    mock_interview_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("student_profiles.student_id"), nullable=False
    )
    job_role_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("job_roles.job_role_id")
    )
    grammar_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    fluency_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    technical_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    overall_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    ai_feedback: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int | None] = mapped_column(Integer)
    transcript_storage_path: Mapped[str | None] = mapped_column(Text)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class CareerChat(Base):
    """Persisted career-assistant chat turn (``career_chat``)."""

    __tablename__ = "career_chat"

    chat_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("student_profiles.student_id"), nullable=False
    )
    question: Mapped[str | None] = mapped_column(Text)
    answer: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Notification(Base):
    """User notification (``notifications``)."""

    __tablename__ = "notifications"

    notification_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.user_id"), nullable=False
    )
    title: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str | None] = mapped_column(Text)
    notification_type: Mapped[str | None] = mapped_column(String(30))
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


# ======================================================================
# Backend-owned interview state (additive; not part of the frozen schema)
# ======================================================================
class InterviewSession(Base):
    """A mock-interview session (``interview_sessions``).

    Holds the configuration and lifecycle of one interview so that the
    question-by-question loop survives across HTTP requests.
    """

    __tablename__ = "interview_sessions"

    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("student_profiles.student_id"), nullable=False
    )
    job_role_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("job_roles.job_role_id")
    )
    role_title: Mapped[str] = mapped_column(String(150), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False)
    interview_type: Mapped[str] = mapped_column(String(30), nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    answered_questions: Mapped[int] = mapped_column(Integer, default=0)
    # PENDING -> IN_PROGRESS -> COMPLETED
    status: Mapped[str] = mapped_column(String(20), default="PENDING")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # --- Aggregated results (populated when the session completes) -----
    # Stored on the session so the result/history endpoints are a single read
    # and so history survives independently of the frozen mock_interviews row.
    overall_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    technical_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    communication_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    confidence_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    relevance_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    summary: Mapped[str | None] = mapped_column(Text)
    strengths_json: Mapped[str | None] = mapped_column(Text)
    improvements_json: Mapped[str | None] = mapped_column(Text)


class InterviewQuestion(Base):
    """A single generated question and the AI evaluation of the answer.

    Scoring columns map to the PRD evaluation dimensions: relevance,
    completeness, role-specific knowledge (``technical_score``), communication,
    fluency and grammar.
    """

    __tablename__ = "interview_questions"

    question_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    session_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("interview_sessions.session_id"), nullable=False
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str | None] = mapped_column(String(50))
    ai_suggested_answer: Mapped[str | None] = mapped_column(Text)
    user_answer: Mapped[str | None] = mapped_column(Text)

    # Per-dimension scores (0-100); null until answered.
    relevance_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    completeness_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    technical_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    communication_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    fluency_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    grammar_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    overall_score: Mapped[float | None] = mapped_column(Numeric(5, 2))

    feedback: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
