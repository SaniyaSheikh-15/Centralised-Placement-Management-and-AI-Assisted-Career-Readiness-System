from sqlalchemy.orm import Session

from backend.app.models.student import Skill, Branch
from backend.app.repositories.skill_repository import SkillRepository
from backend.app.repositories.branch_repository import BranchRepository


class MasterDataService:

    @staticmethod
    def get_skills(
        db: Session,
    ) -> list[Skill]:
        return SkillRepository.get_all(db)

    @staticmethod
    def get_branches(
        db: Session,
    ) -> list[Branch]:
        return BranchRepository.get_all(db)