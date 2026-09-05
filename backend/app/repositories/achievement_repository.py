from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import StudentAchievement


class AchievementRepository:

    @staticmethod
    def create(
        db: Session,
        achievement: StudentAchievement,
    ) -> StudentAchievement:

        db.add(achievement)
        db.commit()
        db.refresh(achievement)

        return achievement

    @staticmethod
    def get_by_id(
        db: Session,
        achievement_id: UUID,
        student_id: UUID,
    ) -> StudentAchievement | None:

        return (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.achievement_id == achievement_id,
                StudentAchievement.student_id == student_id,
            )
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
        student_id: UUID,
    ) -> list[StudentAchievement]:

        return (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.student_id == student_id
            )
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        achievement: StudentAchievement,
    ) -> StudentAchievement:

        db.commit()
        db.refresh(achievement)

        return achievement

    @staticmethod
    def delete(
        db: Session,
        achievement: StudentAchievement,
    ) -> None:

        db.delete(achievement)
        db.commit()