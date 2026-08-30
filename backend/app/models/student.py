from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    Boolean,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base
from backend.app.models.auth import User


class Branch(Base):
    __tablename__ = "branches"

    branch_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    branch_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    branch_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    department: Mapped[str | None] = mapped_column(
        String(100)
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


class Skill(Base):
    __tablename__ = "skills"

    skill_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    skill_name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    category: Mapped[str | None] = mapped_column(
        String(100)
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    student_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False,
    )
    user: Mapped["User"] = relationship(
        "User",
        foreign_keys=[user_id],
    )

    branch_id: Mapped[UUID] = mapped_column(
        ForeignKey("branches.branch_id"),
        nullable=False,
    )

    enrollment_no: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    semester: Mapped[int | None] = mapped_column(
        Integer
    )

    cgpa: Mapped[Decimal | None] = mapped_column(
        Numeric(3, 2)
    )

    graduation_year: Mapped[int | None] = mapped_column(
        Integer
    )

    active_backlogs: Mapped[int | None] = mapped_column(
        Integer,
        default=0,
        server_default=text("0"),
    )

    date_of_birth: Mapped[date | None] = mapped_column(
        Date
    )

    gender: Mapped[str | None] = mapped_column(
        String(20)
    )

    alternate_phone: Mapped[str | None] = mapped_column(
        String(20)
    )

    alternate_email: Mapped[str | None] = mapped_column(
        String(255)
    )

    father_name: Mapped[str | None] = mapped_column(
        String(200)
    )

    mother_name: Mapped[str | None] = mapped_column(
        String(200)
    )

    father_occupation: Mapped[str | None] = mapped_column(
        String(200)
    )

    abc_id: Mapped[str | None] = mapped_column(
        String(50)
    )

    college: Mapped[str | None] = mapped_column(
    String(200)
    )

    degree: Mapped[str | None] = mapped_column(
        String(100)
    )

    ssc_percentage: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2)
    )

    ssc_passing_year: Mapped[int | None] = mapped_column(
        Integer
    )

    hsc_diploma_percentage: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2)
    )

    hsc_diploma_passing_year: Mapped[int | None] = mapped_column(
        Integer
    )

    btech_aggregate: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2)
    )

    t_and_p_interest: Mapped[str | None] = mapped_column(
    String(50)
    )

    placement_interest: Mapped[str | None] = mapped_column(
        String(50)
    )

    career_area: Mapped[str | None] = mapped_column(
        String(200)
    )

    aptitude_prepared: Mapped[bool | None] = mapped_column(
    Boolean
    )

    aptitude_training_details: Mapped[str | None] = mapped_column(
        Text
    )

    languages_known: Mapped[str | None] = mapped_column(
        Text
    )

    english_rating: Mapped[int | None] = mapped_column(
        Integer
    )

    ready_to_relocate: Mapped[bool | None] = mapped_column(
        Boolean
    )

    linkedin_url: Mapped[str | None] = mapped_column(
        Text
    )

    github_url: Mapped[str | None] = mapped_column(
        Text
    )

    portfolio_url: Mapped[str | None] = mapped_column(
        Text
    )

    bio: Mapped[str | None] = mapped_column(
        Text
    )

    resume_completion_percentage: Mapped[int | None] = mapped_column(
        Integer
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )


class StudentSkill(Base):
    __tablename__ = "student_skills"

    student_skill_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.skill_id"),
        nullable=False,
    )

    proficiency_level: Mapped[str | None] = mapped_column(
        String(30)
    )

    years_of_experience: Mapped[Decimal | None] = mapped_column(
        Numeric(3, 1)
    )

    created_at: Mapped[datetime | None] = mapped_column(
    DateTime,
    server_default=text("CURRENT_TIMESTAMP"),
)


class Project(Base):
    __tablename__ = "projects"

    project_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    title: Mapped[str | None] = mapped_column(
        String(200)
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    github_url: Mapped[str | None] = mapped_column(
        Text
    )

    live_demo_url: Mapped[str | None] = mapped_column(
        Text
    )

    start_date: Mapped[date | None] = mapped_column(
        Date
    )

    end_date: Mapped[date | None] = mapped_column(
        Date
    )

    created_at: Mapped[datetime | None] = mapped_column(
    DateTime,
    server_default=text("CURRENT_TIMESTAMP"),
)


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    project_skill_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    project_id: Mapped[UUID] = mapped_column(
        ForeignKey("projects.project_id"),
        nullable=False,
    )

    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.skill_id"),
        nullable=False,
    )

    created_at: Mapped[datetime | None] = mapped_column(
    DateTime,
    server_default=text("CURRENT_TIMESTAMP"),
)


class Certification(Base):
    __tablename__ = "certifications"

    certificate_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    certificate_name: Mapped[str | None] = mapped_column(
        String(200)
    )

    issuing_organization: Mapped[str | None] = mapped_column(
        String(200)
    )

    issue_date: Mapped[date | None] = mapped_column(
        Date
    )

    expiry_date: Mapped[date | None] = mapped_column(
        Date
    )

    credential_url: Mapped[str | None] = mapped_column(
        Text
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )


class Resume(Base):
    __tablename__ = "resumes"

    resume_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    resume_file_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    resume_storage_path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    mime_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    file_size_kb: Mapped[int | None] = mapped_column(
        Integer
    )

    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    is_default: Mapped[bool | None] = mapped_column(
        Boolean,
        default=False,
        server_default=text("FALSE"),
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )
# -------------------------
# Student Internships
# -------------------------

class StudentInternship(Base):
    __tablename__ = "student_internships"

    internship_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    company_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    role_title: Mapped[str | None] = mapped_column(
        String(150)
    )

    location: Mapped[str | None] = mapped_column(
        String(200)
    )

    start_date: Mapped[date | None] = mapped_column(
        Date
    )

    end_date: Mapped[date | None] = mapped_column(
        Date
    )

    is_current: Mapped[bool | None] = mapped_column(
        Boolean,
        default=False,
        server_default=text("FALSE"),
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    certificate_url: Mapped[str | None] = mapped_column(
        Text
    )

    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=text("CURRENT_TIMESTAMP"),
)


# -------------------------
# Student Achievements
# -------------------------

class StudentAchievement(Base):
    __tablename__ = "student_achievements"

    achievement_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text
    )

    issuing_organization: Mapped[str | None] = mapped_column(
        String(200)
    )

    achievement_date: Mapped[date | None] = mapped_column(
        Date
    )

    credential_url: Mapped[str | None] = mapped_column(
        Text
    )

    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=text("CURRENT_TIMESTAMP"),
)
# -------------------------
# Student Social Links
# -------------------------

class StudentSocialLink(Base):
    __tablename__ = "student_social_links"

    social_link_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    platform: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    profile_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
    DateTime,
    nullable=False,
    server_default=text("CURRENT_TIMESTAMP"),
)