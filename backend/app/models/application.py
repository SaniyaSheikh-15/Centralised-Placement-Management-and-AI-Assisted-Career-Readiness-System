from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (UniqueConstraint("student_id", "drive_id", name="uq_applications_student_drive"),)

    application_id: Mapped[UUID] = mapped_column(primary_key=True)
    drive_id: Mapped[UUID] = mapped_column(ForeignKey("placement_drives.drive_id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[UUID] = mapped_column(ForeignKey("student_profiles.student_id", ondelete="CASCADE"), nullable=False)
    resume_id: Mapped[UUID] = mapped_column(ForeignKey("resumes.resume_id"), nullable=False)
    application_status: Mapped[str] = mapped_column(String(30), nullable=False, default="APPLIED", server_default=text("'APPLIED'"))
    applied_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=text("now()"))

    drive = relationship("PlacementDrive")
    student = relationship("StudentProfile")
    resume = relationship("Resume")
    history: Mapped[list["ApplicationStatusHistory"]] = relationship(
        back_populates="application", cascade="all, delete-orphan", order_by="ApplicationStatusHistory.created_at"
    )


class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id: Mapped[UUID] = mapped_column(primary_key=True, server_default=text("gen_random_uuid()"))
    application_id: Mapped[UUID] = mapped_column(
        ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, index=True
    )
    from_status: Mapped[str | None] = mapped_column(String(30))
    to_status: Mapped[str] = mapped_column(String(30), nullable=False)
    remarks: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(30), nullable=False)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=text("now()"))

    application: Mapped[Application] = relationship(back_populates="history")
