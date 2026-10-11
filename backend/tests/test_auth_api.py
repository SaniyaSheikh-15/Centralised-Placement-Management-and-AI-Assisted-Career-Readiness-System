import uuid
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from backend.app.core.security import create_access_token, hash_password
from backend.app.db.session import SessionLocal
from backend.app.main import app
from backend.app.models.auth import OTPCode, Role, User, UserRole
from backend.app.repositories.role_repository import RoleRepository

client = TestClient(app)


def get_random_email(prefix: str = "test") -> str:
    return f"{prefix}.{uuid.uuid4().hex[:8]}@example.com"


def create_test_user_with_role(role_name: str, is_active: bool = True, is_verified: bool = True) -> tuple[User, str]:
    db = SessionLocal()
    try:
        RoleRepository.ensure_default_roles(db)
        role = RoleRepository.get_by_name(db, role_name)

        now = datetime.now(timezone.utc)
        plain_password = "Password123!"
        email = get_random_email(role_name.lower().replace(" ", "_"))

        user = User(
            first_name="Test",
            last_name="User",
            email=email,
            password_hash=hash_password(plain_password),
            is_verified=is_verified,
            is_active=is_active,
            created_at=now,
            updated_at=now,
        )
        db.add(user)
        db.flush()

        user_role = UserRole(
            user_id=user.user_id,
            role_id=role.role_id,
            assigned_at=now,
        )
        db.add(user_role)
        db.commit()
        db.refresh(user)

        token = create_access_token(
            subject=str(user.user_id),
            additional_claims={"role": role.role_name},
        )
        return user, token
    finally:
        db.close()


# ---------------------------------------------------------
# 1. Student Registration Success
# ---------------------------------------------------------
def test_student_registration_success():
    email = get_random_email("student")
    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "email": email,
        "phone": "9876543210",
        "password": "Password123!",
        "role": "student",
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["role"] == "Student"
    assert data["is_verified"] is False


# ---------------------------------------------------------
# 2. Duplicate Email Registration Failure
# ---------------------------------------------------------
def test_duplicate_email_registration_failure():
    email = get_random_email("duplicate")
    payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": email,
        "password": "Password123!",
        "role": "student",
    }
    resp1 = client.post("/auth/register", json=payload)
    assert resp1.status_code == 201

    resp2 = client.post("/auth/register", json=payload)
    assert resp2.status_code == 400
    assert "already registered" in resp2.json()["detail"].lower()


# ---------------------------------------------------------
# 3. Invalid Password Policy Rejection
# ---------------------------------------------------------
def test_invalid_password_rejection():
    email = get_random_email("weakpass")
    payload = {
        "first_name": "Weak",
        "last_name": "Pass",
        "email": email,
        "password": "short",
        "role": "student",
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 422  # Pydantic validation error


# ---------------------------------------------------------
# 4. Recruiter Registration Success
# ---------------------------------------------------------
def test_recruiter_registration_success():
    email = get_random_email("recruiter")
    payload = {
        "company_name": "Acme Corp",
        "first_name": "Alice",
        "last_name": "Smith",
        "designation": "HR Manager",
        "official_email": email,
        "contact_number": "1234567890",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "terms_accepted": True,
    }
    response = client.post("/auth/register/recruiter", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == email
    assert data["role"] == "Recruiter"


# ---------------------------------------------------------
# 5. T&P Access Request Creation
# ---------------------------------------------------------
def test_tp_access_request_creation():
    email = get_random_email("tp_applicant")
    payload = {
        "first_name": "Prof",
        "last_name": "Oak",
        "official_email": email,
        "contact_number": "9998887770",
        "institution_name": "Kanto Institute of Technology",
        "designation": "Placement Head",
        "reason_for_access": "Manage campus placements",
    }
    response = client.post("/auth/tp/request-access", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["official_email"] == email
    assert data["status"] == "PENDING"


# ---------------------------------------------------------
# 6. Placement Officer Direct Public Registration Rejection
# ---------------------------------------------------------
def test_placement_officer_direct_registration_rejection():
    email = get_random_email("direct_tp")
    payload = {
        "first_name": "Sneaky",
        "last_name": "User",
        "email": email,
        "password": "Password123!",
        "role": "placement_officer",
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert "direct registration" in response.json()["detail"].lower()


# ---------------------------------------------------------
# 7 & 8. T&P Request Approval and Rejection Flow
# ---------------------------------------------------------
def test_tp_request_approval_and_rejection_flow():
    _, admin_token = create_test_user_with_role("System Administrator")
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Approve test
    email_approve = get_random_email("tp_approve")
    req1 = client.post("/auth/tp/request-access", json={
        "first_name": "Approved",
        "last_name": "Officer",
        "official_email": email_approve,
        "institution_name": "ABC College",
    }).json()

    req_id_1 = req1["request_id"]
    resp_approve = client.post(f"/auth/tp/requests/{req_id_1}/approve", headers=headers)
    assert resp_approve.status_code == 200
    assert resp_approve.json()["status"] == "APPROVED"

    # Reject test
    email_reject = get_random_email("tp_reject")
    req2 = client.post("/auth/tp/request-access", json={
        "first_name": "Rejected",
        "last_name": "Officer",
        "official_email": email_reject,
        "institution_name": "XYZ College",
    }).json()

    req_id_2 = req2["request_id"]
    resp_reject = client.post(f"/auth/tp/requests/{req_id_2}/reject", headers=headers)
    assert resp_reject.status_code == 200
    assert resp_reject.json()["status"] == "REJECTED"


# ---------------------------------------------------------
# 9. Login Success
# ---------------------------------------------------------
def test_login_success():
    email = get_random_email("loginsuccess")
    client.post("/auth/register", json={
        "first_name": "Login",
        "last_name": "Tester",
        "email": email,
        "password": "Password123!",
        "role": "student",
    })

    login_resp = client.post("/auth/login", json={
        "email": email,
        "password": "Password123!",
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    assert "tokens" in data
    assert "access_token" in data["tokens"]
    assert data["user"]["email"] == email


# ---------------------------------------------------------
# 10. Wrong Password Login Failure
# ---------------------------------------------------------
def test_wrong_password_login_failure():
    email = get_random_email("wrongpass")
    client.post("/auth/register", json={
        "first_name": "Wrong",
        "last_name": "Pass",
        "email": email,
        "password": "Password123!",
        "role": "student",
    })

    response = client.post("/auth/login", json={
        "email": email,
        "password": "IncorrectPassword123!",
    })
    assert response.status_code == 401


# ---------------------------------------------------------
# 11. Nonexistent Email Login Failure
# ---------------------------------------------------------
def test_nonexistent_email_login_failure():
    response = client.post("/auth/login", json={
        "email": "nonexistent.user.12345@example.com",
        "password": "Password123!",
    })
    assert response.status_code == 401


# ---------------------------------------------------------
# 12, 13, 14, 15, 16, 17. JWT Authentication & /auth/me
# ---------------------------------------------------------
def test_auth_me_valid_and_invalid_tokens():
    user, token = create_test_user_with_role("Student")

    # Valid token
    resp_valid = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp_valid.status_code == 200
    assert resp_valid.json()["email"] == user.email

    # Missing token
    resp_no_token = client.get("/auth/me")
    assert resp_no_token.status_code == 403 or resp_no_token.status_code == 401

    # Invalid token
    resp_invalid = client.get("/auth/me", headers={"Authorization": "Bearer invalid_token_123"})
    assert resp_invalid.status_code == 401


# ---------------------------------------------------------
# 18, 19, 20, 21. Email Verification OTP Flows
# ---------------------------------------------------------
def test_email_verification_otp_flow():
    db = SessionLocal()
    try:
        email = get_random_email("verify_otp")
        client.post("/auth/register", json={
            "first_name": "OTP",
            "last_name": "User",
            "email": email,
            "password": "Password123!",
            "role": "student",
        })

        # Fetch generated OTP from DB
        otp_entry = db.execute(
            select(OTPCode).where(OTPCode.email == email, OTPCode.purpose == "EMAIL_VERIFICATION")
        ).scalars().first()
        assert otp_entry is not None
        otp_code = otp_entry.otp_code

        # Invalid OTP test
        resp_invalid = client.post("/auth/verify-email", json={"email": email, "otp": "000000"})
        assert resp_invalid.status_code == 400

        # Valid OTP test
        resp_valid = client.post("/auth/verify-email", json={"email": email, "otp": otp_code})
        assert resp_valid.status_code == 200
        assert resp_valid.json()["is_verified"] is True
    finally:
        db.close()


# ---------------------------------------------------------
# 22, 23, 24, 25. Forgot Password & Reset Password Flows
# ---------------------------------------------------------
def test_forgot_and_reset_password_flow():
    db = SessionLocal()
    try:
        email = get_random_email("reset_pass")
        client.post("/auth/register", json={
            "first_name": "Reset",
            "last_name": "Pass",
            "email": email,
            "password": "OldPassword123!",
            "role": "student",
        })

        # Anti-enumeration response test
        resp_forgot = client.post("/auth/forgot-password", json={"email": email})
        assert resp_forgot.status_code == 200
        assert "password reset code has been sent" in resp_forgot.json()["message"]

        # Fetch reset OTP from DB
        otp_entry = db.execute(
            select(OTPCode).where(OTPCode.email == email, OTPCode.purpose == "PASSWORD_RESET")
        ).scalars().first()
        assert otp_entry is not None
        otp_code = otp_entry.otp_code

        # Reset password
        resp_reset = client.post("/auth/reset-password", json={
            "email": email,
            "otp": otp_code,
            "new_password": "NewPassword123!",
            "confirm_password": "NewPassword123!",
        })
        assert resp_reset.status_code == 200

        # Verify old password fails
        resp_old_login = client.post("/auth/login", json={"email": email, "password": "OldPassword123!"})
        assert resp_old_login.status_code == 401

        # Verify new password works
        resp_new_login = client.post("/auth/login", json={"email": email, "password": "NewPassword123!"})
        assert resp_new_login.status_code == 200
    finally:
        db.close()


# ---------------------------------------------------------
# 26. Role-based Authorization Check
# ---------------------------------------------------------
def test_role_based_authorization_enforcement():
    _, student_token = create_test_user_with_role("Student")
    headers = {"Authorization": f"Bearer {student_token}"}

    # Student attempts to access admin endpoint (list T&P requests or approve)
    resp = client.get("/auth/tp/requests", headers=headers)
    assert resp.status_code == 403
