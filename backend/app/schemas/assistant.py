"""Schemas for Module 2 - AI Career Assistant.

Mirrors the Next.js contracts in ``career-assistant/src/lib/api.ts``
(``ChatApiResponse``, ``GuidanceApiResponse``, resume-QA) so the existing UI can
talk to the FastAPI backend unchanged.
"""

from __future__ import annotations

from uuid import UUID

from pydantic import Field

from app.schemas.common import CamelModel


# ----------------------------------------------------------------------
# Requests
# ----------------------------------------------------------------------
class ChatRequest(CamelModel):
    """Body for ``POST /assistant/chat``."""

    message: str = Field(min_length=1, max_length=4000, description="The student's question.")
    conversation_id: str | None = Field(
        default=None, description="Optional thread id to group consecutive turns."
    )
    student_id: UUID | None = Field(
        default=None, description="Student id (RBAC-checked); defaults to the caller."
    )


class ResumeQARequest(CamelModel):
    """Body for ``POST /assistant/resume-qa``."""

    question: str = Field(min_length=1, max_length=2000)
    student_id: UUID | None = Field(default=None, description="Student id (RBAC-checked).")


# ----------------------------------------------------------------------
# Response building blocks
# ----------------------------------------------------------------------
class GroundingSource(CamelModel):
    """A single piece of retrieved context the answer was grounded on."""

    source: str = Field(description="Table/entity the fact came from.")
    detail: str = Field(description="Human summary of the retrieved record(s).")


class GuidanceProject(CamelModel):
    """A suggested project that closes a skill gap."""

    title: str
    description: str


class GuidanceRoadmapStep(CamelModel):
    """One ordered step in the personalised roadmap."""

    step: str
    order: int


# ----------------------------------------------------------------------
# Responses
# ----------------------------------------------------------------------
class ChatResponse(CamelModel):
    """Returned by ``POST /assistant/chat``."""

    conversation_id: str
    reply: str
    created_at: str
    grounded_on: list[GroundingSource] = Field(
        default_factory=list,
        description="Context records used to ground the answer (RAG transparency).",
    )


class ResumeQAResponse(CamelModel):
    """Returned by ``POST /assistant/resume-qa``."""

    answer: str
    references_resume: bool = Field(
        description="True when the answer used parsed-resume data as its basis."
    )


class ResumeStatusResponse(CamelModel):
    """Returned by ``GET /assistant/resume-status/{student_id}``.

    Mirrors the frontend's ``ResumeStatusResponse`` so the Resume-Q&A UI can
    decide whether to enable that mode.
    """

    has_resume: bool
    file_name: str | None = None
    uploaded_at: str | None = None
    status: str | None = Field(
        default=None, description="Parsing/analysis state, e.g. 'ANALYZED'."
    )


class GuidanceResponse(CamelModel):
    """Returned by ``GET /assistant/guidance/{student_id}``."""

    recommended_role: str
    reasoning: str
    skills_to_learn: list[str] = Field(default_factory=list)
    projects_to_build: list[GuidanceProject] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    roadmap: list[GuidanceRoadmapStep] = Field(default_factory=list)
    grounded_on: list[GroundingSource] = Field(default_factory=list)


# ----------------------------------------------------------------------
# Internal prompt-contract models (AI -> Python)
# ----------------------------------------------------------------------
class ChatAnswerResult(CamelModel):
    """Structured shape the LLM returns for a grounded chat answer."""

    answer: str
    insufficient_context: bool = Field(
        default=False,
        description="True when the model could not answer from the retrieved context.",
    )


class GuidanceResult(CamelModel):
    """Structured shape the LLM returns for the guidance endpoint."""

    recommended_role: str = ""
    reasoning: str = ""
    skills_to_learn: list[str] = Field(default_factory=list)
    projects_to_build: list[GuidanceProject] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    roadmap: list[GuidanceRoadmapStep] = Field(default_factory=list)
