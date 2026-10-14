
from datetime import datetime
from uuid import UUID, uuid4


from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.models.application import Application
from backend.app.models.auth import User
from backend.app.models.placement_drive import PlacementDrive
from backend.app.models.student import StudentProfile
from backend.app.repositories.application_repository import (
    ApplicationRepository,
)
from backend.app.repositories.resume_repository import ResumeRepository



class ApplicationService:

    @staticmethod
    def apply(
        db: Session,
        current_user: User,
        drive_id: UUID,
        resume_id: UUID | None = None,
    ) -> Application:

        student = (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == current_user.user_id)
            .first()
        )

        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        drive = (
            db.query(PlacementDrive)
            .filter(PlacementDrive.drive_id == drive_id)
            .first()
        )

        if drive is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Placement drive not found",
            )

        now = datetime.now()

        if (
            drive.status != "active"
            or drive.registration_deadline is None
            or drive.registration_deadline < now
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Applications are not open for this drive",
            )

        existing = ApplicationRepository.get_by_student_and_drive(
            db,
            student.student_id,
            drive_id,
        )

        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already applied to this drive",
            )

        if resume_id is not None:
            resume = ResumeRepository.get_by_id(
                db,
                resume_id,
                student.student_id,
            )
        else:
            resumes = ResumeRepository.get_by_student(
                db,
                student.student_id,
            )
            resume = next(
                (item for item in resumes if item.is_default),
                resumes[0] if resumes else None,
            )

        if resume is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please upload or select a resume before applying",
            )

        application = Application(
            application_id=uuid4(),
            drive_id=drive.drive_id,
            student_id=student.student_id,
            resume_id=resume.resume_id,
            application_status="APPLIED",
            applied_at=now,
        )

        try:
            return ApplicationRepository.create(db, application)
        except IntegrityError as exc:
            # Handles concurrent duplicate applications safely.
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already applied to this drive",
            ) from exc


    @staticmethod
    def list_my_applications(
        db: Session,
        current_user: User,
        status_filter: str | None = None,
        company: str | None = None,
        role: str | None = None,
    ) -> list[Application]:

        student = (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == current_user.user_id)
            .first()
        )

        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        return ApplicationRepository.get_by_student(
            db,
            student.student_id,
            status_filter,
            company,
            role,
        )



    @staticmethod
    def list_my_applications_with_details(
        db: Session,
        current_user: User,
        status_filter: str | None = None,
        company: str | None = None,
        role: str | None = None,
    ):
        student = (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == current_user.user_id)
            .first()
        )

        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        rows = ApplicationRepository.get_my_applications_with_details(
            db,
            student.student_id,
            status_filter,
            company,
            role,
        )

        return [
            {
                "application_id": application.application_id,
                "drive_id": application.drive_id,
                "student_id": application.student_id,
                "resume_id": application.resume_id,
                "application_status": application.application_status,
                "applied_at": application.applied_at,
                "company_name": company_name,
                "role_title": role_title,
                "drive_title": drive_title,
            }
            for application, company_name, role_title, drive_title in rows
        ]





    @staticmethod
    def get_my_application(
        db: Session,
        current_user: User,
        application_id: UUID,
    ):
        application = ApplicationRepository.get_by_id(
            db,
            application_id,
        )

        if application is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        student = (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == current_user.user_id)
            .first()
        )

        if (
            student is None
            or application.student_id != student.student_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot access another student's application",
            )

        row = ApplicationRepository.get_application_details_with_names(
            db,
            application_id,
        )

        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application details not found",
            )

        application, company_name, role_title, drive_title = row

        return {
            "application_id": application.application_id,
            "drive_id": application.drive_id,
            "student_id": application.student_id,
            "resume_id": application.resume_id,
            "application_status": application.application_status,
            "applied_at": application.applied_at,
            "company_name": company_name,
            "role_title": role_title,
            "drive_title": drive_title,
        }




    @staticmethod
    def withdraw_application(
        db: Session,
        current_user: User,
        application_id: UUID,
    ) -> Application:
        application = ApplicationService.get_my_application(
            db=db,
            current_user=current_user,
            application_id=application_id,
        )

        if application.application_status == "WITHDRAWN":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application has already been withdrawn",
            )

        if application.application_status in ("SELECTED", "REJECTED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This application can no longer be withdrawn",
            )

        application.application_status = "WITHDRAWN"

        return ApplicationRepository.update(db, application)


    @staticmethod
    def update_application_status(
        db: Session,
        application_id: UUID,
        new_status: str,
    ) -> Application:

        application = ApplicationRepository.get_by_id(
            db,
            application_id,
        )

        if application is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        allowed_transitions = {
            "APPLIED": {"SHORTLISTED", "REJECTED"},
            "SHORTLISTED": {"SELECTED", "REJECTED"},
            "SELECTED": set(),
            "REJECTED": set(),
            "WITHDRAWN": set(),
        }

        current_status = application.application_status

        if (
            current_status not in allowed_transitions
            or new_status not in allowed_transitions[current_status]
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Cannot change application status from "
                    f"{current_status} to {new_status}"
                ),
            )

        application.application_status = new_status

        return ApplicationRepository.update(
            db,
            application,
        )
