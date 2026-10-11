from datetime import datetime
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Role(Base):
    __tablename__ = "roles"

    role_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    role_name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime | None] = mapped_column(DateTime)

    updated_at: Mapped[datetime | None] = mapped_column(DateTime)

    user_roles: Mapped[list["UserRole"]] = relationship(
        back_populates="role"
    )


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str | None] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20)
    )

    password_hash: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    profile_photo: Mapped[str | None] = mapped_column(
        Text
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=text("FALSE"),
    )

    email_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    password_changed_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default=text("TRUE"),
    )

    last_login: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    user_roles: Mapped[list["UserRole"]] = relationship(
        back_populates="user"
    )

    recruiter: Mapped["Recruiter | None"] = relationship(
        back_populates="user"
    )


class UserRole(Base):
    __tablename__ = "user_roles"

    user_role_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=False,
    )

    role_id: Mapped[UUID] = mapped_column(
        ForeignKey("roles.role_id"),
        nullable=False,
    )

    assigned_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    user: Mapped["User"] = relationship(
        back_populates="user_roles"
    )

    role: Mapped["Role"] = relationship(
        back_populates="user_roles"
    )


class Company(Base):
    __tablename__ = "companies"

    company_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    company_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    industry: Mapped[str | None] = mapped_column(
        String(100)
    )

    website: Mapped[str | None] = mapped_column(Text)

    email: Mapped[str | None] = mapped_column(
        String(255)
    )

    phone: Mapped[str | None] = mapped_column(
        String(20)
    )

    linkedin_url: Mapped[str | None] = mapped_column(Text)

    headquarters: Mapped[str | None] = mapped_column(
        String(200)
    )

    company_description: Mapped[str | None] = mapped_column(Text)

    logo_url: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    recruiters: Mapped[list["Recruiter"]] = relationship(
        back_populates="company"
    )


class Recruiter(Base):
    __tablename__ = "recruiters"

    recruiter_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False,
    )

    company_id: Mapped[UUID] = mapped_column(
        ForeignKey("companies.company_id"),
        nullable=False,
    )

    designation: Mapped[str | None] = mapped_column(
        String(100)
    )

    official_email: Mapped[str | None] = mapped_column(
        String(255)
    )

    contact_number: Mapped[str | None] = mapped_column(
        String(20)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="recruiter"
    )

    company: Mapped["Company"] = relationship(
        back_populates="recruiters"
    )


class TPAccessRequest(Base):
    __tablename__ = "tp_access_requests"

    request_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str | None] = mapped_column(
        String(100)
    )

    official_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    contact_number: Mapped[str | None] = mapped_column(
        String(20)
    )

    institution_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    designation: Mapped[str | None] = mapped_column(
        String(100)
    )

    reason_for_access: Mapped[str | None] = mapped_column(Text)

    status: Mapped[str] = mapped_column(
        String(20),
        default="PENDING",
        server_default=text("'PENDING'"),
    )

    reviewed_by: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.user_id")
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    reviewer: Mapped["User | None"] = relationship()


class OTPCode(Base):
    __tablename__ = "otps"

    otp_id: Mapped[UUID] = mapped_column(
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )

    user_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.user_id")
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    otp_code: Mapped[str] = mapped_column(
        String(6),
        nullable=False,
    )

    purpose: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    is_used: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=text("FALSE"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    user: Mapped["User | None"] = relationship()