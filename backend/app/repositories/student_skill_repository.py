from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import StudentSkill


class StudentSkillRepository:

    @staticmethod
    def get_by_student(
        db: Session,
        student_id: UUID,
    ) -> list[StudentSkill]:
        return (
            db.query(StudentSkill)
            .filter(StudentSkill.student_id == student_id)
            .order_by(StudentSkill.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        student_skill_id: UUID,
        student_id: UUID,
    ) -> StudentSkill | None:
        return (
            db.query(StudentSkill)
            .filter(
                StudentSkill.student_skill_id == student_skill_id,
                StudentSkill.student_id == student_id,
            )
            .first()
        )

    @staticmethod
    def get_by_skill(
        db: Session,
        student_id: UUID,
        skill_id: UUID,
    ) -> StudentSkill | None:
        return (
            db.query(StudentSkill)
            .filter(
                StudentSkill.student_id == student_id,
                StudentSkill.skill_id == skill_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        student_skill: StudentSkill,
    ) -> StudentSkill:
        db.add(student_skill)
        db.commit()
        db.refresh(student_skill)

        return student_skill

    @staticmethod
    def delete(
        db: Session,
        student_skill: StudentSkill,
    ) -> None:
        db.delete(student_skill)
        db.commit()