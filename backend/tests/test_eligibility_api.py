
from types import SimpleNamespace
from uuid import uuid4
from decimal import Decimal

import pytest

from backend.app.services.eligibility_service import EligibilityService
from backend.app.repositories.placement_drive_repository import (
    PlacementDriveRepository,
)
from backend.app.services.student_service import StudentService


from fastapi import HTTPException
from fastapi.testclient import TestClient

from backend.app.api import placement_drive
from backend.app.main import app
from backend.app.core.dependencies import get_current_user


@pytest.fixture
def profile():
    return SimpleNamespace(
        student_id=uuid4(),
        branch_id=uuid4(),
        cgpa=Decimal("8.00"),
        active_backlogs=0,
        graduation_year=2026,
        ssc_percentage=Decimal("80.00"),
        hsc_diploma_percentage=Decimal("75.00"),
    )


@pytest.fixture
def drive():
    return SimpleNamespace(
        drive_id=uuid4(),
        eligibility_rule=SimpleNamespace(
            minimum_cgpa=Decimal("7.00"),
            maximum_backlogs=0,
            graduation_year=2026,
            minimum_tenth_percentage=Decimal("60.00"),
            minimum_twelfth_percentage=Decimal("60.00"),
        ),
        drive_branches=[],
        drive_skills=[],
    )


def test_all_academic_criteria_pass(monkeypatch, profile, drive):
    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(
        db=None,
        drive_id=drive.drive_id,
        user_id=uuid4(),
    )

    assert result.is_eligible is True
    assert len(result.results) == 5
    assert all(item.passed for item in result.results)


def test_missing_academic_data_fails(monkeypatch, profile, drive):
    profile.graduation_year = None

    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(
        db=None,
        drive_id=drive.drive_id,
        user_id=uuid4(),
    )

    assert result.is_eligible is False

    graduation_result = next(
        item for item in result.results
        if item.criterion == "graduation_year"
    )
    assert graduation_result.passed is False
    assert "missing" in graduation_result.message.lower()


def test_unconfigured_drive_fails_safely(monkeypatch, profile):
    drive = SimpleNamespace(
        drive_id=uuid4(),
        eligibility_rule=None,
        drive_branches=[],
        drive_skills=[],
    )

    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(
        db=None,
        drive_id=drive.drive_id,
        user_id=uuid4(),
    )

    assert result.is_eligible is False
    assert result.results[0].criterion == "configuration"
    assert "no eligibility criteria" in result.results[0].message.lower()


def test_missing_drive_raises_error(monkeypatch):
    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: None,
    )

    with pytest.raises(ValueError, match="Placement drive not found"):
        EligibilityService.evaluate(
            db=None,
            drive_id=uuid4(),
            user_id=uuid4(),
        )


def test_missing_student_profile_raises_error(monkeypatch, drive):
    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: None,
    )

    with pytest.raises(ValueError, match="Student profile not found"):
        EligibilityService.evaluate(
            db=None,
            drive_id=drive.drive_id,
            user_id=uuid4(),
        )


def test_branch_mismatch_fails(monkeypatch, profile, drive):
    drive.drive_branches = [
        SimpleNamespace(branch_id=uuid4())
    ]

    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(
        db=None,
        drive_id=drive.drive_id,
        user_id=uuid4(),
    )

    branch_result = next(
        item for item in result.results
        if item.criterion == "branch"
    )
    assert branch_result.passed is False
    assert result.is_eligible is False


def test_missing_required_skill_fails(monkeypatch, profile, drive):
    required_skill_id = uuid4()
    drive.drive_skills = [
        SimpleNamespace(
            skill_id=required_skill_id,
            minimum_proficiency="beginner",
        )
    ]

    monkeypatch.setattr(
        PlacementDriveRepository,
        "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService,
        "get_profile_by_user_id",
        lambda db, user_id: profile,
    )
    monkeypatch.setattr(
        StudentService,
        "get_skills",
        lambda db, student_id: [],
    )

    result = EligibilityService.evaluate(
        db=None,
        drive_id=drive.drive_id,
        user_id=uuid4(),
    )

    skill_result = next(
        item for item in result.results
        if item.criterion == f"skill:{required_skill_id}"
    )
    assert skill_result.passed is False
    assert result.is_eligible is False


def test_cgpa_below_minimum_fails(monkeypatch, profile, drive):
    profile.cgpa = Decimal("6.99")

    monkeypatch.setattr(
        PlacementDriveRepository, "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService, "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(None, drive.drive_id, uuid4())

    criterion = next(r for r in result.results if r.criterion == "minimum_cgpa")
    assert criterion.passed is False
    assert result.is_eligible is False


def test_maximum_backlogs_exceeded_fails(monkeypatch, profile, drive):
    profile.active_backlogs = 1

    monkeypatch.setattr(
        PlacementDriveRepository, "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService, "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(None, drive.drive_id, uuid4())

    criterion = next(r for r in result.results if r.criterion == "maximum_backlogs")
    assert criterion.passed is False
    assert result.is_eligible is False


def test_exact_academic_boundaries_pass(monkeypatch, profile, drive):
    profile.cgpa = Decimal("7.00")
    profile.active_backlogs = 0
    profile.ssc_percentage = Decimal("60.00")
    profile.hsc_diploma_percentage = Decimal("60.00")
    profile.graduation_year = 2026

    monkeypatch.setattr(
        PlacementDriveRepository, "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService, "get_profile_by_user_id",
        lambda db, user_id: profile,
    )

    result = EligibilityService.evaluate(None, drive.drive_id, uuid4())

    assert result.is_eligible is True
    assert all(item.passed for item in result.results)


def test_required_skill_with_sufficient_proficiency_passes(
    monkeypatch, profile, drive
):
    required_skill_id = uuid4()
    drive.drive_skills = [
        SimpleNamespace(
            skill_id=required_skill_id,
            minimum_proficiency="intermediate",
        )
    ]

    monkeypatch.setattr(
        PlacementDriveRepository, "get_by_id",
        lambda db, drive_id: drive,
    )
    monkeypatch.setattr(
        StudentService, "get_profile_by_user_id",
        lambda db, user_id: profile,
    )
    monkeypatch.setattr(
        StudentService, "get_skills",
        lambda db, student_id: [
            {
                "skill_id": required_skill_id,
                "proficiency_level": "advanced",
            }
        ],
    )

    result = EligibilityService.evaluate(None, drive.drive_id, uuid4())

    criterion = next(
        r for r in result.results
        if r.criterion == f"skill:{required_skill_id}"
    )
    assert criterion.passed is True
    assert result.is_eligible is True


client = TestClient(app)


def test_eligibility_endpoint_success(monkeypatch, profile, drive):
    user_id = uuid4()
    fake_user = SimpleNamespace(user_id=user_id)

    monkeypatch.setattr(
        placement_drive.EligibilityService,
        "evaluate",
        lambda db, drive_id, user_id: {
            "drive_id": drive_id,
            "is_eligible": True,
            "results": [
                {
                    "criterion": "minimum_cgpa",
                    "passed": True,
                    "message": "CGPA requirement satisfied.",
                }
            ],
        },
    )

    app.dependency_overrides[get_current_user] = lambda: fake_user

    try:
        response = client.post(
            f"/placement-drives/{drive.drive_id}/eligibility/evaluate"
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    assert response.json()["is_eligible"] is True
    assert response.json()["drive_id"] == str(drive.drive_id)


@pytest.mark.parametrize(
    "error_message",
    ["Placement drive not found", "Student profile not found"],
)
def test_eligibility_endpoint_not_found(monkeypatch, drive, error_message):
    fake_user = SimpleNamespace(user_id=uuid4())

    def raise_not_found(db, drive_id, user_id):
        raise ValueError(error_message)

    monkeypatch.setattr(
        placement_drive.EligibilityService,
        "evaluate",
        raise_not_found,
    )

    app.dependency_overrides[get_current_user] = lambda: fake_user

    try:
        response = client.post(
            f"/placement-drives/{drive.drive_id}/eligibility/evaluate"
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 404
    assert response.json()["detail"] == error_message


def test_eligibility_endpoint_requires_authentication(drive):
    response = client.post(
        f"/placement-drives/{drive.drive_id}/eligibility/evaluate"
    )

    assert response.status_code == 401



def test_eligibility_endpoint_missing_profile_returns_404(
    monkeypatch, drive
):
    fake_user = SimpleNamespace(user_id=uuid4())

    def raise_missing_profile(db, drive_id, user_id):
        raise ValueError("Student profile not found")

    monkeypatch.setattr(
        placement_drive.EligibilityService,
        "evaluate",
        raise_missing_profile,
    )

    app.dependency_overrides[get_current_user] = lambda: fake_user

    try:
        response = client.post(
            f"/placement-drives/{drive.drive_id}/eligibility/evaluate"
        )
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 404
    assert response.json()["detail"] == "Student profile not found"
