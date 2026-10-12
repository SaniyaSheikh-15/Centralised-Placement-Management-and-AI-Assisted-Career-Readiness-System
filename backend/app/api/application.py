from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.session import get_db
from backend.app.models.application import Application
from backend.app.models.auth import User
from backend.app.schemas.application import ApplyRequest, StatusUpdateRequest
from backend.app.services.application_service import (
    ApplicationServiceError,
    application_view,
    create_application,
    ensure_owner_or_officer,
    get_application,
    list_student_applications,
    update_status,
)


router = APIRouter(tags=["Applications"])


@router.post(
    "/placement-drives/{drive_id}/applications",
    status_code=status.HTTP_201_CREATED,
    summary="Apply to a placement drive",
)
def apply_to_drive(
    drive_id: UUID,
    request: ApplyRequest,
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    try:
        application = create_application(db, current_user, drive_id, request)
        return {"message": "Application submitted successfully.", "application": application_view(db, application)}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.get("/applications/me", summary="List applications for the current student")
def get_my_applications(
    status_filter: str | None = Query(default=None, alias="status"),
    company: str | None = None,
    role: str | None = None,
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    try:
        applications = list_student_applications(db, current_user, status_filter, company, role)
        return {"applications": [application_view(db, application) for application in applications]}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.get("/applications/{application_id}", summary="Get application details")
def get_application_details(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        application = get_application(db, application_id)
        ensure_owner_or_officer(db, application, current_user)
        return {"application": application_view(db, application)}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.get("/applications/{application_id}/status", summary="Get the current application status")
def get_application_status(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        application = get_application(db, application_id)
        ensure_owner_or_officer(db, application, current_user)
        view = application_view(db, application)
        return {"application": {key: view[key] for key in ("applicationId", "status", "nextStep", "nextStepDate", "updatedAt")}}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.get("/applications/{application_id}/timeline", summary="Get application milestones and status history")
def get_application_timeline(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        application = get_application(db, application_id)
        ensure_owner_or_officer(db, application, current_user)
        view = application_view(db, application)
        return {"applicationId": view["applicationId"], "timeline": view["timeline"], "history": view["history"]}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.patch("/applications/{application_id}/status", summary="Advance application status")
def patch_application_status(
    application_id: UUID,
    request: StatusUpdateRequest,
    current_user: User = Depends(require_roles("placement_officer")),
    db: Session = Depends(get_db),
):
    try:
        application = get_application(db, application_id)
        updated = update_status(db, application, request, "PLACEMENT_OFFICER")
        return {"message": "Application status updated.", "application": application_view(db, updated)}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@router.patch("/applications/{application_id}/withdraw", summary="Withdraw a student application")
def withdraw_application(
    application_id: UUID,
    current_user: User = Depends(require_roles("student")),
    db: Session = Depends(get_db),
):
    try:
        application = get_application(db, application_id)
        ensure_owner_or_officer(db, application, current_user)
        updated = update_status(
            db, application,
            StatusUpdateRequest(status="WITHDRAWN", remarks="Application withdrawn by student."),
            "STUDENT",
        )
        return {"message": "Application withdrawn successfully.", "application": application_view(db, updated)}
    except ApplicationServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc
