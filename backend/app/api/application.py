
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.session import get_db
from backend.app.models.auth import User

from backend.app.schemas.application import (
    ApplyRequest,
    ApplicationResponse,
    ApplicationWithDetailsResponse,
    ApplicationStatusUpdate,
)

from backend.app.services.application_service import ApplicationService


router = APIRouter(tags=["Applications"])


@router.post(
    "/placement-drives/{drive_id}/applications",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Apply for a Placement Drive",
)
def apply_for_placement_drive(
    drive_id: UUID,
    request: ApplyRequest,
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    return ApplicationService.apply(
        db=db,
        current_user=current_user,
        drive_id=drive_id,
        resume_id=request.resume_id,
    )




@router.get(
    "/applications/me",
    response_model=list[ApplicationWithDetailsResponse],
    summary="Get My Applications",
)
def get_my_applications(
    status_filter: str | None = Query(default=None, alias="status"),
    company: str | None = Query(default=None),
    role: str | None = Query(default=None),
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    return ApplicationService.list_my_applications_with_details(
        db=db,
        current_user=current_user,
        status_filter=status_filter,
        company=company,
        role=role,
    )




@router.get(
    "/applications/{application_id}/status",
    summary="Get Application Status",
)
def get_application_status(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = ApplicationService.get_my_application(
        db=db,
        current_user=current_user,
        application_id=application_id,
    )

    return {
        "application_id": application.application_id,
        "status": application.application_status,
        "applied_at": application.applied_at,
    }




@router.get(
    "/applications/{application_id}",
    response_model=ApplicationWithDetailsResponse,
    summary="Get My Application Details",
)
def get_my_application(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ApplicationService.get_my_application(
        db=db,
        current_user=current_user,
        application_id=application_id,
    )




@router.patch(
    "/applications/{application_id}/withdraw",
    summary="Withdraw My Application",
)
def withdraw_my_application(
    application_id: UUID,
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    application = ApplicationService.withdraw_application(
        db=db,
        current_user=current_user,
        application_id=application_id,
    )

    return {
        "message": "Application withdrawn successfully",
        "application_id": application.application_id,
        "status": application.application_status,
    }



@router.patch(
    "/applications/{application_id}/status",
    summary="Update Application Status",
)
def update_application_status(
    application_id: UUID,
    request: ApplicationStatusUpdate,
    current_user: User = Depends(
        require_roles("placement_officer")
    ),
    db: Session = Depends(get_db),
):
    application = ApplicationService.update_application_status(
        db=db,
        application_id=application_id,
        new_status=request.status,
    )

    return {
        "message": "Application status updated successfully",
        "application_id": application.application_id,
        "status": application.application_status,
    }
