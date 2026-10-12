from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.models.application import Application, ApplicationStatusHistory
from backend.app.models.auth import Company, User
from backend.app.models.placement_drive import PlacementDrive
from backend.app.models.student import JobRole, Resume, StudentProfile
from backend.app.schemas.application import ApplyRequest, StatusUpdateRequest


LIFECYCLE = [
    "APPLIED", "ELIGIBILITY_VERIFIED", "SHORTLISTED", "ASSESSMENT",
    "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED",
]
TERMINAL = {"SELECTED", "REJECTED", "WITHDRAWN"}
HISTORY_SOURCES = {"STUDENT", "PLACEMENT_OFFICER", "ELIGIBILITY_ENGINE", "SYSTEM"}


class ApplicationServiceError(ValueError):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.status_code = status_code


def get_student_profile(db: Session, user: User) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.user_id).first()
    if not profile:
        raise ApplicationServiceError("Student profile not found.", 404)
    return profile


def create_application(db: Session, user: User, drive_id: UUID, request: ApplyRequest) -> Application:
    student = get_student_profile(db, user)
    drive = db.query(PlacementDrive).filter(PlacementDrive.drive_id == drive_id).first()
    if not drive:
        raise ApplicationServiceError("Placement drive not found.", 404)

    existing = db.query(Application).filter_by(student_id=student.student_id, drive_id=drive_id).first()
    if existing:
        raise ApplicationServiceError("You have already applied to this drive.", 409)

    now = datetime.utcnow()
    if drive.status != "active" or not drive.registration_deadline or drive.registration_deadline < now:
        raise ApplicationServiceError("Application window has closed.", 422)

    resume_query = db.query(Resume).filter(Resume.student_id == student.student_id)
    resume = (
        resume_query.filter(Resume.resume_id == request.resume_id).first()
        if request.resume_id
        else resume_query.filter(Resume.is_default.is_(True)).first()
    )
    if not resume:
        raise ApplicationServiceError("Choose or upload a default resume before applying.", 422)

    application = Application(
        application_id=uuid4(), drive_id=drive_id, student_id=student.student_id,
        resume_id=resume.resume_id, application_status="APPLIED", applied_at=now,
    )
    db.add(application)
    db.flush()
    db.add(ApplicationStatusHistory(
        application_id=application.application_id, from_status=None, to_status="APPLIED",
        remarks="Application submitted.", source="STUDENT", created_at=now,
    ))
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ApplicationServiceError("You have already applied to this drive.", 409) from exc
    db.refresh(application)
    return application


def list_student_applications(db: Session, user: User, status_filter: str | None = None,
                              company: str | None = None, role: str | None = None) -> list[Application]:
    student = get_student_profile(db, user)
    query = db.query(Application).filter(Application.student_id == student.student_id)
    if status_filter:
        query = query.filter(Application.application_status == status_filter)
    applications = query.order_by(Application.applied_at.desc()).all()
    if company:
        needle = company.casefold()
        applications = [item for item in applications if needle in _company_name(db, item).casefold()]
    if role:
        needle = role.casefold()
        applications = [item for item in applications if needle in _role_title(db, item).casefold()]
    return applications


def get_application(db: Session, application_id: UUID) -> Application:
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise ApplicationServiceError("Application not found.", 404)
    return application


def ensure_owner_or_officer(db: Session, application: Application, user: User) -> None:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.user_id).first()
    if profile and profile.student_id == application.student_id:
        return
    roles = {link.role.role_name.lower() for link in user.user_roles if link.role}
    if "placement_officer" not in roles:
        raise ApplicationServiceError("You are not allowed to view this application.", 403)


def update_status(db: Session, application: Application, request: StatusUpdateRequest,
                  source: str = "PLACEMENT_OFFICER") -> Application:
    current = application.application_status
    target = (
        "ELIGIBILITY_VERIFIED" if request.eligibility_result == "ELIGIBLE"
        else "REJECTED" if request.eligibility_result == "NOT_ELIGIBLE"
        else request.status
    )
    if target is None:
        raise ApplicationServiceError("A status update is required.", 400)
    if target not in LIFECYCLE and target not in {"REJECTED", "WITHDRAWN"}:
        raise ApplicationServiceError("Invalid application status.", 400)
    if current == target:
        raise ApplicationServiceError("Application is already in this status.", 409)
    if current in TERMINAL:
        raise ApplicationServiceError("A terminal application cannot be updated.", 409)
    if target not in {"REJECTED", "WITHDRAWN"}:
        if target == "ELIGIBILITY_VERIFIED" and current != "APPLIED":
            raise ApplicationServiceError("Eligibility can only be verified after application submission.", 422)
        if target != "ELIGIBILITY_VERIFIED" and LIFECYCLE.index(target) != LIFECYCLE.index(current) + 1:
            raise ApplicationServiceError(f"Invalid lifecycle transition from {current} to {target}.", 422)

    now = datetime.utcnow()
    application.application_status = target
    db.add(ApplicationStatusHistory(
        application_id=application.application_id, from_status=current, to_status=target,
        remarks=request.remarks, source=source, scheduled_at=request.scheduled_at, created_at=now,
    ))
    db.commit()
    db.refresh(application)
    return application


def application_view(db: Session, application: Application) -> dict:
    drive = application.drive or db.query(PlacementDrive).filter_by(drive_id=application.drive_id).first()
    company = db.query(Company).filter_by(company_id=drive.company_id).first() if drive else None
    job_role = db.query(JobRole).filter_by(job_role_id=drive.job_role_id).first() if drive else None
    resume = application.resume or db.query(Resume).filter_by(resume_id=application.resume_id).first()
    histories = sorted(application.history, key=lambda item: item.created_at)
    status = application.application_status
    next_label = _humanize(status) if status in TERMINAL else _humanize(LIFECYCLE[LIFECYCLE.index(status) + 1])
    timeline = _timeline(status, histories)
    return {
        "id": str(application.application_id),
        "applicationId": f"APP-{application.application_id.hex[:8].upper()}",
        "driveId": str(application.drive_id),
        "companyName": company.company_name if company else "Company",
        "companyLogo": company.logo_url if company else None,
        "role": (job_role.role_title if job_role else None) or (drive.drive_title if drive else "Placement role"),
        "appliedAt": application.applied_at,
        "updatedAt": histories[-1].created_at if histories else application.applied_at,
        "status": status,
        "nextStep": next_label,
        "nextStepDate": next((row.scheduled_at for row in reversed(histories) if row.scheduled_at), None),
        "resumeName": resume.resume_file_name if resume else None,
        "timeline": timeline,
        "history": [
            {"id": str(row.id), "fromStatus": row.from_status, "toStatus": row.to_status,
             "remarks": row.remarks, "source": row.source, "createdAt": row.created_at}
            for row in histories
        ],
    }


def _timeline(current: str, histories: list[ApplicationStatusHistory]) -> list[dict]:
    stages = list(LIFECYCLE)
    if current in {"REJECTED", "WITHDRAWN"}:
        stages.append(current)
    current_index = stages.index(current)
    latest_for_stage = {row.to_status: row for row in histories}
    return [{
        "stage": stage, "label": _humanize(stage),
        "status": "REJECTED" if stage == "REJECTED" else "WITHDRAWN" if stage == "WITHDRAWN" else
                  "CURRENT" if stage == current else "COMPLETED" if index < current_index else "UPCOMING",
        "description": (latest_for_stage[stage].remarks or f"{_humanize(stage)} stage.") if stage in latest_for_stage else f"{_humanize(stage)} stage.",
        "date": latest_for_stage[stage].scheduled_at or latest_for_stage[stage].created_at if stage in latest_for_stage else None,
    } for index, stage in enumerate(stages)]


def _company_name(db: Session, application: Application) -> str:
    drive = application.drive or db.query(PlacementDrive).filter_by(drive_id=application.drive_id).first()
    company = db.query(Company).filter_by(company_id=drive.company_id).first() if drive else None
    return company.company_name if company else ""


def _role_title(db: Session, application: Application) -> str:
    drive = application.drive or db.query(PlacementDrive).filter_by(drive_id=application.drive_id).first()
    role = db.query(JobRole).filter_by(job_role_id=drive.job_role_id).first() if drive else None
    return (role.role_title if role else None) or (drive.drive_title if drive else "")


def _humanize(status: str) -> str:
    return status.replace("_", " ").title()
