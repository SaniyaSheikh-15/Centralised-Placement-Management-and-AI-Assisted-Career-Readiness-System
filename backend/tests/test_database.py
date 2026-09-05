from sqlalchemy import text

from backend.app.db.session import engine


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        assert result.scalar() == 1


def test_users_table_exists():
    with engine.connect() as connection:
        result = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
                """
            )
        )

        assert result.scalar() == 1
from sqlalchemy import select, text

from backend.app.db.session import engine, SessionLocal
from backend.app.models import Role, User, UserRole


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        assert result.scalar() == 1


def test_users_table_exists():
    with engine.connect() as connection:
        result = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
                """
            )
        )

        assert result.scalar() == 1


def test_auth_models_can_query_database():
    with SessionLocal() as db:
        db.execute(select(Role)).all()
        db.execute(select(User)).all()
        db.execute(select(UserRole)).all()