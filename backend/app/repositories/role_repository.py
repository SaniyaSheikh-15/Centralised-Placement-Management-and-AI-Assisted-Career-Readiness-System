from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.auth import Role


class RoleRepository:

    ROLE_NAME_MAP = {
        "student": "Student",
        "recruiter": "Recruiter",
        "placement_officer": "Placement Officer",
        "system_administrator": "System Administrator",
        "admin": "System Administrator",
    }

    @staticmethod
    def get_by_name(
        db: Session,
        role_name: str,
    ) -> Role | None:

        database_role_name = RoleRepository.ROLE_NAME_MAP.get(
            role_name.lower(),
            role_name,
        )

        statement = select(Role).where(
            Role.role_name == database_role_name
        )

        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def ensure_default_roles(db: Session) -> None:
        now = datetime.now(timezone.utc)
        default_roles = [
            ("Student", "User who manages a profile and applies to placements."),
            ("Recruiter", "Company representative managing recruitment activities."),
            ("Placement Officer", "Placement team member coordinating drives."),
            ("System Administrator", "Authorized admin managing platform configuration."),
        ]

        for r_name, desc in default_roles:
            existing = db.execute(
                select(Role).where(Role.role_name == r_name)
            ).scalar_one_or_none()

            if not existing:
                role = Role(
                    role_name=r_name,
                    description=desc,
                    created_at=now,
                    updated_at=now,
                )
                db.add(role)
        db.flush()