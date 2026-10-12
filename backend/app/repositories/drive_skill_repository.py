"""
drive_skill_repository.py
Database query layer for drive_skills table.
"""

from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.placement_drive import DriveSkill


class DriveSkillRepository:

    @staticmethod
    def get_by_drive(
        db: Session,
        drive_id: UUID,
    ) -> list[DriveSkill]:

        return (
            db.query(DriveSkill)
            .filter(DriveSkill.drive_id == drive_id)
            .all()
        )

    @staticmethod
    def get_by_drive_and_skill(
        db: Session,
        drive_id: UUID,
        skill_id: UUID,
    ) -> DriveSkill | None:

        return (
            db.query(DriveSkill)
            .filter(
                DriveSkill.drive_id == drive_id,
                DriveSkill.skill_id == skill_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        drive_skill: DriveSkill,
    ) -> DriveSkill:

        db.add(drive_skill)
        db.commit()
        db.refresh(drive_skill)

        return drive_skill

    @staticmethod
    def delete(
        db: Session,
        drive_skill: DriveSkill,
    ) -> None:

        db.delete(drive_skill)
        db.commit()
