"""
test_placement_drive_api.py
Pytest test suite for the Placement Drive Management API endpoints.
Tests CRUD operations, status transitions, eligibility rules,
drive branches, and drive skills.
"""

import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from backend.app.core.security import create_access_token, hash_password
from backend.app.db.session import SessionLocal
from backend.app.main import app
from backend.app.models.auth import (
    Company,
    Recruiter,
    Role,
    User,
    UserRole,
)
from backend.app.models.placement_drive import PlacementDrive
from backend.app.models.student import Branch, Skill
from backend.app.repositories.role_repository import RoleRepository

client = TestClient(app)


# =========================================================================
# HELPERS
# =========================================================================

def get_random_email(prefix: str = "test") -> str:
    return f"{prefix}.{uuid.uuid4().hex[:8]}@example.com"


def get_auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def create_recruiter_with_company(
    db=None,
) -> tuple[User, str, Company, Recruiter]:
    """
    Creates a verified recruiter user with a company.
    Returns (user, jwt_token, company, recruiter).
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        RoleRepository.ensure_default_roles(db)

        role = RoleRepository.get_by_name(db, "Recruiter")

        now = datetime.now(timezone.utc)
        email = get_random_email("recruiter")

        user = User(
            first_name="Test",
            last_name="Recruiter",
            email=email,
            password_hash=hash_password("Password123!"),
            is_verified=True,
            is_active=True,
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

        company = Company(
            company_name=f"TestCorp-{uuid.uuid4().hex[:6]}",
            industry="Technology",
            created_at=now,
            updated_at=now,
        )
        db.add(company)
        db.flush()

        recruiter = Recruiter(
            user_id=user.user_id,
            company_id=company.company_id,
            designation="HR Manager",
            official_email=email,
            created_at=now,
            updated_at=now,
        )
        db.add(recruiter)

        db.commit()
        db.refresh(user)
        db.refresh(company)
        db.refresh(recruiter)

        token = create_access_token(
            subject=str(user.user_id),
            additional_claims={"role": "Recruiter"},
        )

        return user, token, company, recruiter

    finally:
        if close_db:
            db.close()


def create_student_user() -> tuple[User, str]:
    """Creates a verified student user. Returns (user, jwt_token)."""
    db = SessionLocal()
    try:
        RoleRepository.ensure_default_roles(db)
        role = RoleRepository.get_by_name(db, "Student")

        now = datetime.now(timezone.utc)
        email = get_random_email("student")

        user = User(
            first_name="Test",
            last_name="Student",
            email=email,
            password_hash=hash_password("Password123!"),
            is_verified=True,
            is_active=True,
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
            additional_claims={"role": "Student"},
        )

        return user, token

    finally:
        db.close()


def get_or_create_job_role(db) -> uuid.UUID:
    """Get first job_role or create one."""
    from backend.app.models.student import Skill  # noqa

    # Try raw SQL to check for job_roles
    from sqlalchemy import text as sa_text

    result = db.execute(
        sa_text("SELECT job_role_id FROM job_roles LIMIT 1")
    ).fetchone()

    if result:
        return result[0]

    # Create one
    job_role_id = uuid.uuid4()
    db.execute(
        sa_text(
            "INSERT INTO job_roles (job_role_id, role_title, category, created_at) "
            "VALUES (:id, :title, :cat, :now)"
        ),
        {
            "id": job_role_id,
            "title": "Software Developer",
            "cat": "Engineering",
            "now": datetime.now(timezone.utc),
        },
    )
    db.commit()

    return job_role_id


def create_drive_payload(
    company_id: uuid.UUID,
    recruiter_id: uuid.UUID,
    job_role_id: uuid.UUID,
) -> dict:
    """Builds a valid placement drive creation payload."""
    return {
        "company_id": str(company_id),
        "recruiter_id": str(recruiter_id),
        "job_role_id": str(job_role_id),
        "drive_title": "Software Engineer 2026 Campus Drive",
        "job_description": "Full-stack developer role for fresh graduates.",
        "employment_type": "FULL_TIME",
        "work_mode": "HYBRID",
        "location": "Bangalore, India",
        "minimum_package_lpa": "6.00",
        "maximum_package_lpa": "12.00",
        "vacancies": 25,
        "status": "upcoming",
    }


# =========================================================================
# TESTS — CREATE PLACEMENT DRIVE
# =========================================================================

class TestCreatePlacementDrive:

    def test_create_drive_success(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )

        response = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        assert response.status_code == 201
        data = response.json()
        assert data["drive_title"] == payload["drive_title"]
        assert data["status"] == "upcoming"
        assert data["employment_type"] == "FULL_TIME"

    def test_create_drive_missing_title(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        del payload["drive_title"]

        response = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        assert response.status_code == 422

    def test_create_drive_invalid_package_range(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        payload["minimum_package_lpa"] = "15.00"
        payload["maximum_package_lpa"] = "8.00"

        response = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        assert response.status_code == 422

    def test_create_drive_student_unauthorized(self):
        """Students should not be able to create drives."""
        user, token = create_student_user()

        payload = {
            "company_id": str(uuid.uuid4()),
            "recruiter_id": str(uuid.uuid4()),
            "job_role_id": str(uuid.uuid4()),
            "drive_title": "Test Drive",
            "status": "upcoming",
        }

        response = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        assert response.status_code == 403


# =========================================================================
# TESTS — GET PLACEMENT DRIVES
# =========================================================================

class TestGetPlacementDrives:

    def test_list_drives(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        # Create a drive first
        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        # List drives
        response = client.get(
            "/placement-drives",
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        data = response.json()
        assert "drives" in data
        assert "total" in data
        assert data["total"] >= 1

    def test_list_drives_with_status_filter(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
        finally:
            db.close()

        response = client.get(
            "/placement-drives?status=upcoming",
            headers=get_auth_header(token),
        )

        assert response.status_code == 200

    def test_get_drive_by_id(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        # Create a drive
        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        drive_id = create_resp.json()["drive_id"]

        # Get by ID
        response = client.get(
            f"/placement-drives/{drive_id}",
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        assert response.json()["drive_id"] == drive_id

    def test_get_drive_not_found(self):
        db = SessionLocal()
        try:
            user, token, _, _ = create_recruiter_with_company(db)
        finally:
            db.close()

        response = client.get(
            f"/placement-drives/{uuid.uuid4()}",
            headers=get_auth_header(token),
        )

        assert response.status_code == 404


# =========================================================================
# TESTS — UPDATE PLACEMENT DRIVE
# =========================================================================

class TestUpdatePlacementDrive:

    def test_update_drive_success(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        drive_id = create_resp.json()["drive_id"]

        # Update
        update_payload = {
            "drive_title": "Updated Drive Title",
            "vacancies": 50,
        }

        response = client.put(
            f"/placement-drives/{drive_id}",
            json=update_payload,
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        assert response.json()["drive_title"] == "Updated Drive Title"
        assert response.json()["vacancies"] == 50


# =========================================================================
# TESTS — DELETE PLACEMENT DRIVE
# =========================================================================

class TestDeletePlacementDrive:

    def test_delete_drive_success(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        drive_id = create_resp.json()["drive_id"]

        response = client.delete(
            f"/placement-drives/{drive_id}",
            headers=get_auth_header(token),
        )

        assert response.status_code == 204

    def test_delete_drive_not_found(self):
        db = SessionLocal()
        try:
            user, token, _, _ = create_recruiter_with_company(db)
        finally:
            db.close()

        response = client.delete(
            f"/placement-drives/{uuid.uuid4()}",
            headers=get_auth_header(token),
        )

        assert response.status_code == 404


# =========================================================================
# TESTS — STATUS TRANSITIONS
# =========================================================================

class TestDriveStatusTransitions:

    def _create_drive(self) -> tuple[str, str, dict]:
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        return create_resp.json()["drive_id"], token, create_resp.json()

    def test_valid_transition_upcoming_to_active(self):
        drive_id, token, _ = self._create_drive()

        response = client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "active"},
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        assert response.json()["status"] == "active"

    def test_valid_transition_active_to_closed(self):
        drive_id, token, _ = self._create_drive()

        # First: upcoming → active
        client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "active"},
            headers=get_auth_header(token),
        )

        # Then: active → closed
        response = client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "closed"},
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        assert response.json()["status"] == "closed"

    def test_invalid_transition_closed_to_active(self):
        drive_id, token, _ = self._create_drive()

        # upcoming → active → closed
        client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "active"},
            headers=get_auth_header(token),
        )
        client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "closed"},
            headers=get_auth_header(token),
        )

        # closed → active (should fail)
        response = client.patch(
            f"/placement-drives/{drive_id}/status",
            json={"status": "active"},
            headers=get_auth_header(token),
        )

        assert response.status_code == 400


# =========================================================================
# TESTS — ELIGIBILITY RULES
# =========================================================================

class TestEligibilityRules:

    def test_set_eligibility(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        drive_id = create_resp.json()["drive_id"]

        eligibility = {
            "minimum_cgpa": "7.00",
            "maximum_backlogs": 0,
            "graduation_year": 2026,
            "minimum_tenth_percentage": "60.00",
            "minimum_twelfth_percentage": "60.00",
        }

        response = client.put(
            f"/placement-drives/{drive_id}/eligibility",
            json=eligibility,
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
        data = response.json()
        assert data["drive_id"] == drive_id
        assert data["maximum_backlogs"] == 0

    def test_get_eligibility(self):
        db = SessionLocal()
        try:
            user, token, company, recruiter = create_recruiter_with_company(db)
            job_role_id = get_or_create_job_role(db)
        finally:
            db.close()

        payload = create_drive_payload(
            company.company_id,
            recruiter.recruiter_id,
            job_role_id,
        )
        create_resp = client.post(
            "/placement-drives",
            json=payload,
            headers=get_auth_header(token),
        )

        drive_id = create_resp.json()["drive_id"]

        # Set eligibility first
        client.put(
            f"/placement-drives/{drive_id}/eligibility",
            json={"minimum_cgpa": "7.50"},
            headers=get_auth_header(token),
        )

        # Get eligibility
        response = client.get(
            f"/placement-drives/{drive_id}/eligibility",
            headers=get_auth_header(token),
        )

        assert response.status_code == 200
