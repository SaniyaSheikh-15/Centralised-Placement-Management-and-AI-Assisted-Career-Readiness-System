from sqlalchemy.orm import Session

from backend.app.models.student import Skill
from backend.app.repositories.skill_repository import SkillRepository


class MasterDataService:

    @staticmethod
    def get_skills(
        db: Session,
    ) -> list[Skill]:
        return SkillRepository.get_all(db)