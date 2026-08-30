from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import ProjectSkill


class ProjectSkillRepository:

    @staticmethod
    def get_by_project(
        db: Session,
        project_id: UUID,
    ) -> list[ProjectSkill]:
        return (
            db.query(ProjectSkill)
            .filter(ProjectSkill.project_id == project_id)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        project_skill_id: UUID,
        project_id: UUID,
    ) -> ProjectSkill | None:
        return (
            db.query(ProjectSkill)
            .filter(
                ProjectSkill.project_skill_id == project_skill_id,
                ProjectSkill.project_id == project_id,
            )
            .first()
        )

    @staticmethod
    def get_existing(
        db: Session,
        project_id: UUID,
        skill_id: UUID,
    ) -> ProjectSkill | None:
        return (
            db.query(ProjectSkill)
            .filter(
                ProjectSkill.project_id == project_id,
                ProjectSkill.skill_id == skill_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        project_skill: ProjectSkill,
    ) -> ProjectSkill:
        db.add(project_skill)
        db.commit()
        db.refresh(project_skill)

        return project_skill

    @staticmethod
    def delete(
        db: Session,
        project_skill: ProjectSkill,
    ) -> None:
        db.delete(project_skill)
        db.commit()