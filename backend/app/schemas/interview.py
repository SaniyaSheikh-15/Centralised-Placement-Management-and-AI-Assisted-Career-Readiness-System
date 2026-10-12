"""Schemas for Module 1 - AI Mock Interview.

Request/response shapes deliberately mirror the TypeScript contracts in
``career-assistant/src/types/mock-interview.ts`` (camelCase over the wire) so
the existing UI can consume the FastAPI backend with no reshaping.
"""

from __future__ import annotations

from enum import Enum
from uuid import UUID

from pydantic import Field

from app.schemas.common import CamelModel

# ----------------------------------------------------------------------
# Enumerations (values match the frontend union types exactly)
# ----------------------------------------------------------------------
class DifficultyLevel(str, Enum):
    """Interview difficulty."""

    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class InterviewType(str, Enum):
    """Interview style/focus."""

    TECHNICAL = "Technical"
    BEHAVIORAL = "Behavioral"
    SYSTEM_DESIGN = "System Design"
    MIXED = "Mixed"


class QuestionCategory(str, Enum):
    """Category tag attached to each generated question."""

    TECHNICAL = "Technical"
    BEHAVIORAL = "Behavioral"
    SYSTEM_DESIGN = "System Design"
    MIXED = "Mixed"


# ----------------------------------------------------------------------
# Requests
# ----------------------------------------------------------------------
class StartInterviewRequest(CamelModel):
    """Body for ``POST /interviews/start``."""

    role: str = Field(min_length=2, max_length=150, description="Target job role.")
    difficulty: DifficultyLevel = DifficultyLevel.INTERMEDIATE
    type: InterviewType = InterviewType.MIXED
    question_count: int = Field(default=5, ge=1, le=15, description="1-15 questions.")
    # Optional: officers may start a session on behalf of a student. When
    # omitted the student is resolved from the JWT (the normal case).
    student_id: UUID | None = Field(default=None, description="Student id (RBAC-checked).")


class SubmitAnswerRequest(CamelModel):
    """Body for ``POST /interviews/{session_id}/answer``."""

    question_id: str = Field(min_length=1, description="Id of the question being answered.")
    answer: str = Field(min_length=1, description="The student's textual answer.")


# ----------------------------------------------------------------------
# Response building blocks
# ----------------------------------------------------------------------
class InterviewQuestionOut(CamelModel):
    """A single interview question plus any evaluation already computed."""

    id: str
    question_number: int
    question_text: str
    category: str
    user_answer: str | None = None
    ai_suggested_answer: str | None = None
    feedback: str | None = None
    score: float | None = Field(default=None, description="Per-question overall score (0-100).")


class AnswerEvaluation(CamelModel):
    """The six PRD evaluation dimensions for one answer (0-100 each)."""

    relevance: float
    completeness: float
    technical: float = Field(description="Role-specific knowledge / technical accuracy.")
    communication: float
    fluency: float
    grammar: float
    overall: float
    feedback: str = Field(description="Constructive, specific feedback for the student.")


class ScoreBreakdown(CamelModel):
    """Aggregate score breakdown returned with the final report."""

    technical: float
    communication: float
    confidence: float
    relevance: float


# ----------------------------------------------------------------------
# Responses
# ----------------------------------------------------------------------
class StartInterviewResponse(CamelModel):
    """Returned by ``POST /interviews/start``."""

    session_id: str
    role: str
    difficulty: DifficultyLevel
    type: InterviewType
    total_questions: int
    first_question: InterviewQuestionOut
    created_at: str


class SubmitAnswerResponse(CamelModel):
    """Returned by ``POST /interviews/{session_id}/answer``."""

    session_id: str
    is_complete: bool
    next_question: InterviewQuestionOut | None = None
    question_number: int = Field(description="Number of questions answered so far.")
    total_questions: int
    evaluation: AnswerEvaluation | None = Field(
        default=None, description="Evaluation of the answer just submitted."
    )


class InterviewResultResponse(CamelModel):
    """Returned by ``GET /interviews/{session_id}/result`` (final report)."""

    interview_id: str
    role: str
    date: str
    difficulty: DifficultyLevel
    overall_score: float
    score_breakdown: ScoreBreakdown
    strengths: list[str]
    improvements: list[str]
    questions: list[InterviewQuestionOut]


class SessionDetailResponse(CamelModel):
    """Returned by ``GET /interviews/{session_id}/session``.

    Lets the interview UI resume an in-progress session (re-fetch the questions
    it has already generated and the one currently awaiting an answer).
    """

    session_id: str
    role: str
    difficulty: DifficultyLevel
    type: InterviewType
    status: str
    total_questions: int
    answered_questions: int
    created_at: str
    questions: list[InterviewQuestionOut] = Field(default_factory=list)
    current_question: InterviewQuestionOut | None = None


class InterviewHistoryItem(CamelModel):
    """A single row in the interview history list."""

    session_id: str
    date: str
    role: str
    difficulty: DifficultyLevel
    overall_score: float
    technical: float
    communication: float


class InterviewHistoryResponse(CamelModel):
    """Returned by ``GET /interviews/history``."""

    student_id: str
    sessions: list[InterviewHistoryItem]
    total_sessions: int


# ----------------------------------------------------------------------
# Internal prompt-contract model (AI -> Python)
# ----------------------------------------------------------------------
class GeneratedQuestion(CamelModel):
    """Structured shape the LLM must return when generating a question."""

    question_text: str
    category: str = "Technical"
    ai_suggested_answer: str = ""


class EvaluationResult(CamelModel):
    """Structured shape the LLM must return when evaluating an answer."""

    relevance: float
    completeness: float
    technical: float
    communication: float
    fluency: float
    grammar: float
    feedback: str = ""


class SessionSummaryResult(CamelModel):
    """Structured shape the LLM must return for the final summary."""

    strengths: list[str] = Field(default_factory=list)
    improvements: list[str] = Field(default_factory=list)
    summary: str = ""
