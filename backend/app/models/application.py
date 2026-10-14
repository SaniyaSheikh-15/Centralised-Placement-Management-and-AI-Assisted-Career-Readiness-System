
from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Application(Base):
    __tablename__ = "applications"


    application_id: Mapped[UUID] = mapped_column(primary_key=True)

    drive_id: Mapped[UUID] = mapped_column(
        ForeignKey("placement_drives.drive_id"),
        nullable=False,
    )

    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("student_profiles.student_id"),
        nullable=False,
    )

    resume_id: Mapped[UUID] = mapped_column(
        ForeignKey("resumes.resume_id"),
        nullable=False,
    )

    application_status: Mapped[str | None] = mapped_column(
        String(30),
    )

    applied_at: Mapped[datetime | None] = mapped_column(
        DateTime,
    )

    drive = relationship("PlacementDrive")
    student = relationship("StudentProfile")
    resume = relationship("Resume")
