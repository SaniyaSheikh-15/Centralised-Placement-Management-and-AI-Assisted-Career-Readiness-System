from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import Certification


class CertificationRepository:

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: UUID,
    ) -> list[Certification]:
        return (
            db.query(Certification)
            .filter(Certification.student_id == student_id)
            .order_by(Certification.issue_date.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        certificate_id: UUID,
        student_id: UUID,
    ) -> Certification | None:
        return (
            db.query(Certification)
            .filter(
                Certification.certificate_id == certificate_id,
                Certification.student_id == student_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        certification: Certification,
    ) -> Certification:
        db.add(certification)
        db.commit()
        db.refresh(certification)

        return certification

    @staticmethod
    def delete(
        db: Session,
        certification: Certification,
    ) -> None:
        db.delete(certification)
        db.commit()