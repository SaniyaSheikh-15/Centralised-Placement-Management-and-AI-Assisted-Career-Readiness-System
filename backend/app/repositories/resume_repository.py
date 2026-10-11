from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import Resume


class ResumeRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        resume_id: UUID,
        student_id: UUID | None = None,
    ) -> Resume | None:
        query = (
            db.query(Resume)
            .filter(Resume.resume_id == resume_id)
        )

        # When student_id is supplied, enforce ownership.
        if student_id is not None:
            query = query.filter(
                Resume.student_id == student_id
            )

        return query.first()

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: UUID,
    ) -> list[Resume]:
        return (
            db.query(Resume)
            .filter(
                Resume.student_id == student_id
            )
            .order_by(
                Resume.version.desc()
            )
            .all()
        )

    @staticmethod
    def get_latest_version(
        db: Session,
        student_id: UUID,
    ) -> int:
        latest = (
            db.query(Resume.version)
            .filter(
                Resume.student_id == student_id
            )
            .order_by(
                Resume.version.desc()
            )
            .first()
        )

        if latest is None:
            return 0

        return int(latest[0])

    @staticmethod
    def create(
        db: Session,
        resume: Resume,
    ) -> Resume:
        db.add(resume)

        try:
            db.commit()
            db.refresh(resume)
        except Exception:
            db.rollback()
            raise

        return resume

    @staticmethod
    def delete(
        db: Session,
        resume: Resume,
    ) -> None:
        db.delete(resume)

        try:
            db.commit()
        except Exception:
            db.rollback()
            raise