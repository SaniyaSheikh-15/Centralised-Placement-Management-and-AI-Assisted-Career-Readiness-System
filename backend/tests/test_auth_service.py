import uuid
from backend.app.db.session import SessionLocal
from backend.app.services.auth_service import AuthService
from backend.app.schemas.auth import RegisterRequest


def test_register_student():

    db = SessionLocal()
    unique_email = f"test.student.{uuid.uuid4().hex[:8]}@example.com"

    try:
        request = RegisterRequest(
            first_name="Test",
            last_name="Student",
            email=unique_email,
            password="TestPassword123!",
            role="student",
        )

        user = AuthService.register_user(
            db,
            request,
        )

        assert user.user_id is not None
        assert user.email == unique_email
        assert user.password_hash != "TestPassword123!"

    finally:
        db.close()