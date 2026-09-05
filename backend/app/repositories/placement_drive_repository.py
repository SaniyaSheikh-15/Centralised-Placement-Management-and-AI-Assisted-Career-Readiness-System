"""
placement_drive_repository.py
Database query layer for placement_drives table.
"""

from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from backend.app.models.placement_drive import PlacementDrive


class PlacementDriveRepository:

    @staticmethod
    def get_all(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        status_filter: str | None = None,
        company_id_filter: UUID | None = None,
    ) -> list[PlacementDrive]:

        query = db.query(PlacementDrive)

        if status_filter:
            query = query.filter(
                PlacementDrive.status == status_filter
            )

        if company_id_filter:
            query = query.filter(
                PlacementDrive.company_id == company_id_filter
            )

        return (
            query
            .order_by(PlacementDrive.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def count(
        db: Session,
        status_filter: str | None = None,
        company_id_filter: UUID | None = None,
    ) -> int:

        query = db.query(PlacementDrive)

        if status_filter:
            query = query.filter(
                PlacementDrive.status == status_filter
            )

        if company_id_filter:
            query = query.filter(
                PlacementDrive.company_id == company_id_filter
            )

        return query.count()

    @staticmethod
    def get_by_id(
        db: Session,
        drive_id: UUID,
    ) -> PlacementDrive | None:

        return (
            db.query(PlacementDrive)
            .options(
                joinedload(PlacementDrive.eligibility_rule),
                joinedload(PlacementDrive.drive_branches),
                joinedload(PlacementDrive.drive_skills),
                joinedload(PlacementDrive.drive_documents),
            )
            .filter(PlacementDrive.drive_id == drive_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        drive: PlacementDrive,
    ) -> PlacementDrive:

        db.add(drive)
        db.commit()
        db.refresh(drive)

        return drive

    @staticmethod
    def update(
        db: Session,
        drive: PlacementDrive,
    ) -> PlacementDrive:

        db.commit()
        db.refresh(drive)

        return drive

    @staticmethod
    def delete(
        db: Session,
        drive: PlacementDrive,
    ) -> None:

        db.delete(drive)
        db.commit()
