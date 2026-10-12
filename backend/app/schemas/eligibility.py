
from uuid import UUID

from pydantic import BaseModel, Field


class EligibilityCriterionResult(BaseModel):
    criterion: str
    passed: bool
    message: str


class EligibilityEvaluationResponse(BaseModel):
    drive_id: UUID
    is_eligible: bool
    results: list[EligibilityCriterionResult] = Field(
        default_factory=list
    )
