from sqlalchemy.orm import Session

from backend.app.models.student import Skill


class SkillRepository:

    @staticmethod
    def get_all(db: Session) -> list[Skill]:
        return (
            db.query(Skill)
            .order_by(Skill.skill_name.asc())
            .all()
        )