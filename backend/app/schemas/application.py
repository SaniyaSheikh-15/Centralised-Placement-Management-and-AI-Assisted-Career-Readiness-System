
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


ApplicationStatus = Literal[
    "APPLIED",
    "ELIGIBILITY_VERIFIED",
    "SHORTLISTED",
    "ASSESSMENT",
    "TECHNICAL_INTERVIEW",
    "HR_INTERVIEW",
    "SELECTED",
    "REJECTED",
    "WITHDRAWN",
]


class ApplyRequest(BaseModel):
    resume_id: UUID | None = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    remarks: str | None = Field(default=None, max_length=2000)
    scheduled_at: datetime | None = None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    application_id: UUID
    drive_id: UUID
    student_id: UUID
    resume_id: UUID
    application_status: str | None
    applied_at: datetime | None


class ApplicationWithDetailsResponse(ApplicationResponse):
    company_name: str | None = None
    role_title: str | None = None
    drive_title: str | None = None
