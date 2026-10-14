
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.application import Application
from backend.app.models.auth import Company
from backend.app.models.placement_drive import PlacementDrive
from backend.app.models.student import JobRole


class ApplicationRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        application_id: UUID,
    ) -> Application | None:
        return (
            db.query(Application)
            .filter(Application.application_id == application_id)
            .first()
        )

    @staticmethod
    def get_by_student_and_drive(
        db: Session,
        student_id: UUID,
        drive_id: UUID,
    ) -> Application | None:
        return (
            db.query(Application)
            .filter(
                Application.student_id == student_id,
                Application.drive_id == drive_id,
            )
            .first()
        )


    @staticmethod
    def get_by_student(
        db: Session,
        student_id: UUID,
        status_filter: str | None = None,
        company: str | None = None,
        role: str | None = None,
    ) -> list[Application]:
        query = db.query(Application).filter(
            Application.student_id == student_id
        )

        if status_filter:
            query = query.filter(
                Application.application_status == status_filter
            )

        if company or role:
            query = query.join(
                PlacementDrive,
                Application.drive_id == PlacementDrive.drive_id,
            )

        if company:
            query = query.join(
                Company,
                PlacementDrive.company_id == Company.company_id,
            ).filter(
                Company.company_name.ilike(f"%{company.strip()}%")
            )

        if role:
            query = query.join(
                JobRole,
                PlacementDrive.job_role_id == JobRole.job_role_id,
            ).filter(
                JobRole.role_title.ilike(f"%{role.strip()}%")
            )

        return query.order_by(
            Application.applied_at.desc()
        ).all()



    @staticmethod
    def get_my_applications_with_details(
        db: Session,
        student_id: UUID,
        status_filter: str | None = None,
        company: str | None = None,
        role: str | None = None,
    ):
        query = (
            db.query(
                Application,
                Company.company_name.label("company_name"),
                JobRole.role_title.label("role_title"),
                PlacementDrive.drive_title.label("drive_title"),
            )
            .join(
                PlacementDrive,
                Application.drive_id == PlacementDrive.drive_id,
            )
            .join(
                Company,
                PlacementDrive.company_id == Company.company_id,
            )
            .join(
                JobRole,
                PlacementDrive.job_role_id == JobRole.job_role_id,
            )
            .filter(Application.student_id == student_id)
        )

        if status_filter:
            query = query.filter(
                Application.application_status == status_filter
            )

        if company:
            query = query.filter(
                Company.company_name.ilike(f"%{company.strip()}%")
            )

        if role:
            query = query.filter(
                JobRole.role_title.ilike(f"%{role.strip()}%")
            )

        return query.order_by(
            Application.applied_at.desc()
        ).all()



    @staticmethod
    def get_application_details_with_names(
        db: Session,
        application_id: UUID,
    ):
        return (
            db.query(
                Application,
                Company.company_name.label("company_name"),
                JobRole.role_title.label("role_title"),
                PlacementDrive.drive_title.label("drive_title"),
            )
            .join(
                PlacementDrive,
                Application.drive_id == PlacementDrive.drive_id,
            )
            .join(
                Company,
                PlacementDrive.company_id == Company.company_id,
            )
            .join(
                JobRole,
                PlacementDrive.job_role_id == JobRole.job_role_id,
            )
            .filter(Application.application_id == application_id)
            .first()
        )




    @staticmethod
    def create(
        db: Session,
        application: Application,
    ) -> Application:
        db.add(application)

        try:
            db.commit()
            db.refresh(application)
        except Exception:
            db.rollback()
            raise

        return application

    @staticmethod
    def update(
        db: Session,
        application: Application,
    ) -> Application:
        try:
            db.commit()
            db.refresh(application)
        except Exception:
            db.rollback()
            raise

        return application
