"""
drive_branch_repository.py
Database query layer for drive_branches table.
"""

from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.placement_drive import DriveBranch


class DriveBranchRepository:

    @staticmethod
    def get_by_drive(
        db: Session,
        drive_id: UUID,
    ) -> list[DriveBranch]:

        return (
            db.query(DriveBranch)
            .filter(DriveBranch.drive_id == drive_id)
            .all()
        )

    @staticmethod
    def get_by_drive_and_branch(
        db: Session,
        drive_id: UUID,
        branch_id: UUID,
    ) -> DriveBranch | None:

        return (
            db.query(DriveBranch)
            .filter(
                DriveBranch.drive_id == drive_id,
                DriveBranch.branch_id == branch_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        drive_branch: DriveBranch,
    ) -> DriveBranch:

        db.add(drive_branch)
        db.commit()
        db.refresh(drive_branch)

        return drive_branch

    @staticmethod
    def delete(
        db: Session,
        drive_branch: DriveBranch,
    ) -> None:

        db.delete(drive_branch)
        db.commit()
