"""
placement_drive.py
FastAPI API routes for Placement Drive Management.
Provides endpoints for CRUD operations, status management,
eligibility rules, branches, and skills.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.session import get_db
from backend.app.models.auth import User
from backend.app.schemas.placement_drive import (
    DriveBranchCreate,
    DriveBranchResponse,
    DriveSkillCreate,
    DriveSkillResponse,
    DriveStatusUpdate,
    EligibilityRuleCreate,
    EligibilityRuleResponse,
    PlacementDriveCreate,
    PlacementDriveDetailResponse,
    PlacementDriveListResponse,
    PlacementDriveResponse,
    PlacementDriveUpdate,
)
from backend.app.services.placement_drive_service import (
    PlacementDriveService,
)


router = APIRouter(
    prefix="/placement-drives",
    tags=["Placement Drives"],
)


# ---------------------------------------------------------
# CREATE PLACEMENT DRIVE
# ---------------------------------------------------------

@router.post(
    "",
    response_model=PlacementDriveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Placement Drive",
)
def create_placement_drive(
    request: PlacementDriveCreate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.create_drive(
            db,
            request,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ---------------------------------------------------------
# GET ALL PLACEMENT DRIVES (Paginated + Filterable)
# ---------------------------------------------------------

@router.get(
    "",
    response_model=PlacementDriveListResponse,
    summary="Get All Placement Drives",
)
def get_all_placement_drives(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    company_id: UUID | None = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    drives, total = PlacementDriveService.get_drives(
        db,
        page=page,
        page_size=page_size,
        status=status_filter,
        company_id=company_id,
    )

    return PlacementDriveListResponse(
        total=total,
        page=page,
        page_size=page_size,
        drives=drives,
    )


# ---------------------------------------------------------
# GET PLACEMENT DRIVE BY ID
# ---------------------------------------------------------

@router.get(
    "/{drive_id}",
    response_model=PlacementDriveDetailResponse,
    summary="Get Placement Drive Details",
)
def get_placement_drive(
    drive_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.get_drive_by_id(
            db,
            drive_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


# ---------------------------------------------------------
# UPDATE PLACEMENT DRIVE
# ---------------------------------------------------------

@router.put(
    "/{drive_id}",
    response_model=PlacementDriveResponse,
    summary="Update Placement Drive",
)
def update_placement_drive(
    drive_id: UUID,
    request: PlacementDriveUpdate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.update_drive(
            db,
            drive_id,
            request,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


# ---------------------------------------------------------
# DELETE / DEACTIVATE PLACEMENT DRIVE
# ---------------------------------------------------------

@router.delete(
    "/{drive_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Placement Drive",
)
def delete_placement_drive(
    drive_id: UUID,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        PlacementDriveService.delete_drive(
            db,
            drive_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return None


# ---------------------------------------------------------
# UPDATE DRIVE STATUS
# ---------------------------------------------------------

@router.patch(
    "/{drive_id}/status",
    response_model=PlacementDriveResponse,
    summary="Update Drive Status",
)
def update_drive_status(
    drive_id: UUID,
    request: DriveStatusUpdate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.update_status(
            db,
            drive_id,
            request,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ---------------------------------------------------------
# ELIGIBILITY RULES
# ---------------------------------------------------------

@router.get(
    "/{drive_id}/eligibility",
    response_model=EligibilityRuleResponse | None,
    summary="Get Eligibility Rules",
)
def get_eligibility_rules(
    drive_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PlacementDriveService.get_eligibility(
        db,
        drive_id,
    )


@router.put(
    "/{drive_id}/eligibility",
    response_model=EligibilityRuleResponse,
    summary="Set/Update Eligibility Rules",
)
def set_eligibility_rules(
    drive_id: UUID,
    request: EligibilityRuleCreate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.set_eligibility(
            db,
            drive_id,
            request,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


# ---------------------------------------------------------
# DRIVE BRANCHES (Eligible Branches)
# ---------------------------------------------------------

@router.get(
    "/{drive_id}/branches",
    response_model=list[DriveBranchResponse],
    summary="Get Drive Branches",
)
def get_drive_branches(
    drive_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PlacementDriveService.get_branches(
        db,
        drive_id,
    )


@router.post(
    "/{drive_id}/branches",
    response_model=DriveBranchResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Eligible Branch",
)
def add_drive_branch(
    drive_id: UUID,
    request: DriveBranchCreate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.add_branch(
            db,
            drive_id,
            request.branch_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/{drive_id}/branches/{branch_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove Eligible Branch",
)
def remove_drive_branch(
    drive_id: UUID,
    branch_id: UUID,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        PlacementDriveService.remove_branch(
            db,
            drive_id,
            branch_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return None


# ---------------------------------------------------------
# DRIVE SKILLS (Required Skills)
# ---------------------------------------------------------

@router.get(
    "/{drive_id}/skills",
    response_model=list[DriveSkillResponse],
    summary="Get Required Skills",
)
def get_drive_skills(
    drive_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PlacementDriveService.get_skills(
        db,
        drive_id,
    )


@router.post(
    "/{drive_id}/skills",
    response_model=DriveSkillResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Required Skill",
)
def add_drive_skill(
    drive_id: UUID,
    request: DriveSkillCreate,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        return PlacementDriveService.add_skill(
            db,
            drive_id,
            request,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.delete(
    "/{drive_id}/skills/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove Required Skill",
)
def remove_drive_skill(
    drive_id: UUID,
    skill_id: UUID,
    current_user: User = Depends(
        require_roles("recruiter", "placement_officer")
    ),
    db: Session = Depends(get_db),
):
    try:
        PlacementDriveService.remove_skill(
            db,
            drive_id,
            skill_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    return None
