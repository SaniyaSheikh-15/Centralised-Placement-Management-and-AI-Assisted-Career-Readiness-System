from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from backend.app.models.auth import User


class UserRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: UUID,
    ) -> User | None:
        statement = (
            select(User)
            .options(
                joinedload(User.user_roles)
            )
            .where(
                User.user_id == user_id
            )
        )

        return (
            db.execute(statement)
            .unique()
            .scalars()
            .first()
        )

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:
        statement = (
            select(User)
            .options(
                joinedload(User.user_roles)
            )
            .where(
                User.email == email
            )
        )

        return (
            db.execute(statement)
            .unique()
            .scalars()
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        user: User,
    ) -> User:
        db.add(user)
        db.flush()

        return user

    @staticmethod
    def update(
        db: Session,
        user: User,
    ) -> User:
        db.add(user)
        db.flush()

        return user