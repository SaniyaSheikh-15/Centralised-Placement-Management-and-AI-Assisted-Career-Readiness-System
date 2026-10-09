"""
placement_drive.py
Pydantic v2 schemas for the Placement Drive Management module.
Handles request validation and response serialization.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


# ─── Drive Status Constants ──────────────────────────────────────────────────
VALID_DRIVE_STATUSES = {"upcoming", "active", "closed"}

VALID_EMPLOYMENT_TYPES = {
    "FULL_TIME",
    "INTERNSHIP",
    "FULL_TIME_WITH_INTERNSHIP",
    "CONTRACT",
}

VALID_WORK_MODES = {"ON_SITE", "REMOTE", "HYBRID"}


# =========================================================================
# Eligibility Rule Schemas
# =========================================================================

class EligibilityRuleCreate(BaseModel):
    minimum_cgpa: Decimal | None = Field(
        default=None,
        ge=0,
        le=10,
    )
    maximum_backlogs: int | None = Field(
        default=None,
        ge=0,
    )
    graduation_year: int | None = None
    minimum_tenth_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    minimum_twelfth_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )


class EligibilityRuleUpdate(BaseModel):
    minimum_cgpa: Decimal | None = Field(
        default=None,
        ge=0,
        le=10,
    )
    maximum_backlogs: int | None = Field(
        default=None,
        ge=0,
    )
    graduation_year: int | None = None
    minimum_tenth_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )
    minimum_twelfth_percentage: Decimal | None = Field(
        default=None,
        ge=0,
        le=100,
    )


class EligibilityRuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    eligibility_rule_id: UUID
    drive_id: UUID
    minimum_cgpa: Decimal | None = None
    maximum_backlogs: int | None = None
    graduation_year: int | None = None
    minimum_tenth_percentage: Decimal | None = None
    minimum_twelfth_percentage: Decimal | None = None
    created_at: datetime | None = None


# =========================================================================
# Drive Branch Schemas
# =========================================================================

class DriveBranchCreate(BaseModel):
    branch_id: UUID


class DriveBranchResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drive_branch_id: UUID
    drive_id: UUID
    branch_id: UUID


# =========================================================================
# Drive Skill Schemas
# =========================================================================

class DriveSkillCreate(BaseModel):
    skill_id: UUID
    minimum_proficiency: str | None = None


class DriveSkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drive_skill_id: UUID
    drive_id: UUID
    skill_id: UUID
    minimum_proficiency: str | None = None


# =========================================================================
# Drive Document Schemas
# =========================================================================

class DriveDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drive_document_id: UUID
    drive_id: UUID
    document_name: str | None = None
    document_type: str | None = None
    document_storage_path: str | None = None
    uploaded_at: datetime | None = None


# =========================================================================
# Placement Drive Schemas
# =========================================================================

class PlacementDriveCreate(BaseModel):
    company_id: UUID
    recruiter_id: UUID
    job_role_id: UUID

    drive_title: str = Field(
        min_length=3,
        max_length=255,
    )

    job_description: str | None = None
    employment_type: str | None = None
    work_mode: str | None = None
    location: str | None = Field(
        default=None,
        max_length=150,
    )

    minimum_package_lpa: Decimal | None = Field(
        default=None,
        ge=0,
    )
    maximum_package_lpa: Decimal | None = Field(
        default=None,
        ge=0,
    )

    vacancies: int | None = Field(
        default=None,
        ge=1,
    )

    registration_deadline: datetime | None = None
    drive_date: datetime | None = None

    status: str | None = Field(default="upcoming")

    # Optional nested creation
    eligibility: EligibilityRuleCreate | None = None
    branch_ids: list[UUID] | None = None
    skill_requirements: list[DriveSkillCreate] | None = None

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, v: str | None) -> str | None:
        if v is not None and v not in VALID_EMPLOYMENT_TYPES:
            raise ValueError(
                f"Invalid employment type. Must be one of: "
                f"{', '.join(sorted(VALID_EMPLOYMENT_TYPES))}"
            )
        return v

    @field_validator("work_mode")
    @classmethod
    def validate_work_mode(cls, v: str | None) -> str | None:
        if v is not None and v not in VALID_WORK_MODES:
            raise ValueError(
                f"Invalid work mode. Must be one of: "
                f"{', '.join(sorted(VALID_WORK_MODES))}"
            )
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str | None) -> str | None:
        if v is not None and v not in VALID_DRIVE_STATUSES:
            raise ValueError(
                f"Invalid status. Must be one of: "
                f"{', '.join(sorted(VALID_DRIVE_STATUSES))}"
            )
        return v

    @model_validator(mode="after")
    def validate_package_range(self) -> "PlacementDriveCreate":
        if (
            self.minimum_package_lpa is not None
            and self.maximum_package_lpa is not None
            and self.maximum_package_lpa < self.minimum_package_lpa
        ):
            raise ValueError(
                "maximum_package_lpa must be greater than or "
                "equal to minimum_package_lpa"
            )
        return self


class PlacementDriveUpdate(BaseModel):
    drive_title: str | None = Field(
        default=None,
        min_length=3,
        max_length=255,
    )

    job_description: str | None = None
    employment_type: str | None = None
    work_mode: str | None = None
    location: str | None = Field(
        default=None,
        max_length=150,
    )

    minimum_package_lpa: Decimal | None = Field(
        default=None,
        ge=0,
    )
    maximum_package_lpa: Decimal | None = Field(
        default=None,
        ge=0,
    )

    vacancies: int | None = Field(
        default=None,
        ge=1,
    )

    registration_deadline: datetime | None = None
    drive_date: datetime | None = None

    @field_validator("employment_type")
    @classmethod
    def validate_employment_type(cls, v: str | None) -> str | None:
        if v is not None and v not in VALID_EMPLOYMENT_TYPES:
            raise ValueError(
                f"Invalid employment type. Must be one of: "
                f"{', '.join(sorted(VALID_EMPLOYMENT_TYPES))}"
            )
        return v

    @field_validator("work_mode")
    @classmethod
    def validate_work_mode(cls, v: str | None) -> str | None:
        if v is not None and v not in VALID_WORK_MODES:
            raise ValueError(
                f"Invalid work mode. Must be one of: "
                f"{', '.join(sorted(VALID_WORK_MODES))}"
            )
        return v


class DriveStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_DRIVE_STATUSES:
            raise ValueError(
                f"Invalid status. Must be one of: "
                f"{', '.join(sorted(VALID_DRIVE_STATUSES))}"
            )
        return v


class PlacementDriveResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    drive_id: UUID
    company_id: UUID
    recruiter_id: UUID
    job_role_id: UUID
    drive_title: str | None = None
    job_description: str | None = None
    employment_type: str | None = None
    work_mode: str | None = None
    location: str | None = None
    minimum_package_lpa: Decimal | None = None
    maximum_package_lpa: Decimal | None = None
    vacancies: int | None = None
    registration_deadline: datetime | None = None
    drive_date: datetime | None = None
    status: str | None = None
    created_at: datetime
    updated_at: datetime


class PlacementDriveDetailResponse(PlacementDriveResponse):
    """Extended response with nested eligibility, branches, skills, docs."""

    eligibility_rule: EligibilityRuleResponse | None = None
    drive_branches: list[DriveBranchResponse] = []
    drive_skills: list[DriveSkillResponse] = []
    drive_documents: list[DriveDocumentResponse] = []


class PlacementDriveListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    drives: list[PlacementDriveResponse]
