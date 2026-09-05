"""
placement_drive.py
SQLAlchemy ORM models for the Placement Drive Management module.
Maps to: placement_drives, eligibility_rules, drive_branches,
         drive_skills, drive_documents tables.
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


# ─── Drive Status Constants ──────────────────────────────────────────────────
VALID_DRIVE_STATUSES = {"upcoming", "active", "closed"}

# Valid status transitions
DRIVE_STATUS_TRANSITIONS = {
    "upcoming": ["active", "closed"],
    "active": ["closed"],
    "closed": [],
}


class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    drive_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    company_id: Mapped[UUID] = mapped_column(
        ForeignKey("companies.company_id"),
        nullable=False,
    )

    recruiter_id: Mapped[UUID] = mapped_column(
        ForeignKey("recruiters.recruiter_id"),
        nullable=False,
    )

    job_role_id: Mapped[UUID] = mapped_column(
        ForeignKey("job_roles.job_role_id"),
        nullable=False,
    )

    drive_title: Mapped[str | None] = mapped_column(
        String(255)
    )

    job_description: Mapped[str | None] = mapped_column(
        Text
    )

    employment_type: Mapped[str | None] = mapped_column(
        String(50)
    )

    work_mode: Mapped[str | None] = mapped_column(
        String(50)
    )

    location: Mapped[str | None] = mapped_column(
        String(150)
    )

    minimum_package_lpa: Mapped[Decimal | None] = mapped_column(
        Numeric(6, 2)
    )

    maximum_package_lpa: Mapped[Decimal | None] = mapped_column(
        Numeric(6, 2)
    )

    vacancies: Mapped[int | None] = mapped_column(
        Integer
    )

    registration_deadline: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    drive_date: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    status: Mapped[str | None] = mapped_column(
        String(30),
        default="upcoming",
        server_default=text("'upcoming'"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    # ─── Relationships ──────────────────────────────────────────────────
    company: Mapped["Company"] = relationship()  # noqa: F821
    recruiter: Mapped["Recruiter"] = relationship()  # noqa: F821

    eligibility_rule: Mapped["EligibilityRule | None"] = relationship(
        back_populates="drive",
        uselist=False,
    )

    drive_branches: Mapped[list["DriveBranch"]] = relationship(
        back_populates="drive",
        cascade="all, delete-orphan",
    )

    drive_skills: Mapped[list["DriveSkill"]] = relationship(
        back_populates="drive",
        cascade="all, delete-orphan",
    )

    drive_documents: Mapped[list["DriveDocument"]] = relationship(
        back_populates="drive",
        cascade="all, delete-orphan",
    )


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    eligibility_rule_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    drive_id: Mapped[UUID] = mapped_column(
        ForeignKey("placement_drives.drive_id"),
        unique=True,
        nullable=False,
    )

    minimum_cgpa: Mapped[Decimal | None] = mapped_column(
        Numeric(3, 2)
    )

    maximum_backlogs: Mapped[int | None] = mapped_column(
        Integer
    )

    graduation_year: Mapped[int | None] = mapped_column(
        Integer
    )

    minimum_tenth_percentage: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2)
    )

    minimum_twelfth_percentage: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2)
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    # ─── Relationships ──────────────────────────────────────────────────
    drive: Mapped["PlacementDrive"] = relationship(
        back_populates="eligibility_rule",
    )


class DriveBranch(Base):
    __tablename__ = "drive_branches"

    drive_branch_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    drive_id: Mapped[UUID] = mapped_column(
        ForeignKey("placement_drives.drive_id"),
        nullable=False,
    )

    branch_id: Mapped[UUID] = mapped_column(
        ForeignKey("branches.branch_id"),
        nullable=False,
    )

    # ─── Relationships ──────────────────────────────────────────────────
    drive: Mapped["PlacementDrive"] = relationship(
        back_populates="drive_branches",
    )


class DriveSkill(Base):
    __tablename__ = "drive_skills"

    drive_skill_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    drive_id: Mapped[UUID] = mapped_column(
        ForeignKey("placement_drives.drive_id"),
        nullable=False,
    )

    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.skill_id"),
        nullable=False,
    )

    minimum_proficiency: Mapped[str | None] = mapped_column(
        String(30)
    )

    # ─── Relationships ──────────────────────────────────────────────────
    drive: Mapped["PlacementDrive"] = relationship(
        back_populates="drive_skills",
    )


class DriveDocument(Base):
    __tablename__ = "drive_documents"

    drive_document_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    drive_id: Mapped[UUID] = mapped_column(
        ForeignKey("placement_drives.drive_id"),
        nullable=False,
    )

    document_name: Mapped[str | None] = mapped_column(
        String(255)
    )

    document_type: Mapped[str | None] = mapped_column(
        String(50)
    )

    document_storage_path: Mapped[str | None] = mapped_column(
        Text
    )

    uploaded_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    # ─── Relationships ──────────────────────────────────────────────────
    drive: Mapped["PlacementDrive"] = relationship(
        back_populates="drive_documents",
    )
