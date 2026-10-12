"""Placement-domain tables.

Covers ``companies``, ``recruiters``, ``placement_drives``,
``eligibility_rules``, ``drive_branches``, ``drive_skills``, ``applications``
and ``drive_documents``. The Career Assistant reads the drives + eligibility to
ground its recommendations in real, currently-open opportunities.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, utcnow


class Company(Base, TimestampMixin):
    """Hiring company (``companies``)."""

    __tablename__ = "companies"

    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    industry: Mapped[str | None] = mapped_column(String(100))
    website: Mapped[str | None] = mapped_column(Text)
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(20))
    linkedin_url: Mapped[str | None] = mapped_column(Text)
    headquarters: Mapped[str | None] = mapped_column(String(200))
    company_description: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(Text)


class Recruiter(Base, TimestampMixin):
    """Company recruiter (``recruiters``)."""

    __tablename__ = "recruiters"

    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.user_id"), unique=True, nullable=False
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("companies.company_id"), nullable=False
    )
    designation: Mapped[str | None] = mapped_column(String(100))
    official_email: Mapped[str | None] = mapped_column(String(255))
    contact_number: Mapped[str | None] = mapped_column(String(20))


class PlacementDrive(Base, TimestampMixin):
    """A placement drive / job opening (``placement_drives``)."""

    __tablename__ = "placement_drives"

    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("companies.company_id"), nullable=False
    )
    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("recruiters.recruiter_id"), nullable=False
    )
    job_role_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("job_roles.job_role_id"), nullable=False
    )
    drive_title: Mapped[str | None] = mapped_column(String(255))
    job_description: Mapped[str | None] = mapped_column(Text)
    employment_type: Mapped[str | None] = mapped_column(String(50))
    work_mode: Mapped[str | None] = mapped_column(String(50))
    location: Mapped[str | None] = mapped_column(String(150))
    minimum_package_lpa: Mapped[float | None] = mapped_column(Numeric(6, 2))
    maximum_package_lpa: Mapped[float | None] = mapped_column(Numeric(6, 2))
    vacancies: Mapped[int | None] = mapped_column(Integer)
    registration_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    drive_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str | None] = mapped_column(String(30))


class EligibilityRule(Base):
    """Eligibility criteria for a drive (``eligibility_rules``)."""

    __tablename__ = "eligibility_rules"

    eligibility_rule_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("placement_drives.drive_id"), unique=True, nullable=False
    )
    minimum_cgpa: Mapped[float | None] = mapped_column(Numeric(3, 2))
    maximum_backlogs: Mapped[int | None] = mapped_column(Integer)
    graduation_year: Mapped[int | None] = mapped_column(Integer)
    minimum_tenth_percentage: Mapped[float | None] = mapped_column(Numeric(5, 2))
    minimum_twelfth_percentage: Mapped[float | None] = mapped_column(Numeric(5, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class DriveBranch(Base):
    """Eligible branches for a drive (``drive_branches``)."""

    __tablename__ = "drive_branches"

    drive_branch_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("placement_drives.drive_id"), nullable=False
    )
    branch_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("branches.branch_id"), nullable=False
    )


class DriveSkill(Base):
    """A skill required by a drive (``drive_skills``)."""

    __tablename__ = "drive_skills"

    drive_skill_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("placement_drives.drive_id"), nullable=False
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("skills.skill_id"), nullable=False
    )
    minimum_proficiency: Mapped[str | None] = mapped_column(String(30))


class Application(Base):
    """A student's application to a drive (``applications``)."""

    __tablename__ = "applications"

    application_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("placement_drives.drive_id"), nullable=False
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("student_profiles.student_id"), nullable=False
    )
    resume_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("resumes.resume_id"), nullable=False
    )
    application_status: Mapped[str | None] = mapped_column(String(30))
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class DriveDocument(Base):
    """A document attached to a drive (``drive_documents``)."""

    __tablename__ = "drive_documents"

    drive_document_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    drive_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("placement_drives.drive_id"), nullable=False
    )
    document_name: Mapped[str | None] = mapped_column(String(255))
    document_type: Mapped[str | None] = mapped_column(String(50))
    document_storage_path: Mapped[str | None] = mapped_column(Text)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
