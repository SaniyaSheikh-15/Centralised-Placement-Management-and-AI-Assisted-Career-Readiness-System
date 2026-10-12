from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


ApplicationStatus = Literal[
    "APPLIED", "ELIGIBILITY_VERIFIED", "SHORTLISTED", "ASSESSMENT",
    "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED", "REJECTED", "WITHDRAWN",
]


class ApplyRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    resume_id: UUID | None = Field(default=None, alias="resumeId")


class StatusUpdateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    status: ApplicationStatus | None = None
    remarks: str | None = Field(default=None, max_length=1000)
    scheduled_at: datetime | None = Field(default=None, alias="scheduledAt")
    eligibility_result: Literal["ELIGIBLE", "NOT_ELIGIBLE"] | None = Field(default=None, alias="eligibilityResult")

    @field_validator("remarks")
    @classmethod
    def strip_remarks(cls, value: str | None) -> str | None:
        return value.strip() or None if value is not None else None

    @model_validator(mode="after")
    def require_update(self):
        if self.status is None and self.eligibility_result is None:
            raise ValueError("Provide status or eligibilityResult.")
        if self.eligibility_result == "ELIGIBLE" and self.status not in (None, "ELIGIBILITY_VERIFIED"):
            raise ValueError("An eligible result can only advance to ELIGIBILITY_VERIFIED.")
        if self.eligibility_result == "NOT_ELIGIBLE" and self.status not in (None, "REJECTED"):
            raise ValueError("A not-eligible result must reject the application.")
        return self
