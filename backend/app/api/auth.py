from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, require_roles
from backend.app.db.session import get_db
from backend.app.models.auth import User
from backend.app.schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RecruiterRegisterRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResendVerificationRequest,
    TPAccessRequestCreate,
    TPAccessRequestResponse,
    TokenResponse,
    UserResponse,
    VerifyEmailRequest,
    VerifyOTPRequest,
)
from backend.app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def build_user_response(user: User) -> UserResponse:
    role_name = user.user_roles[0].role.role_name if user.user_roles else None
    return UserResponse(
        user_id=user.user_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        is_verified=user.is_verified,
        is_active=user.is_active,
        role=role_name,
    )


# ---------------------------------------------------------
# REGISTRATION (STUDENT & RECRUITER)
# ---------------------------------------------------------

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Student Account",
)
def register_student(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.register_user(db, request)
        return build_user_response(user)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/register/recruiter",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Recruiter Account",
)
def register_recruiter(
    request: RecruiterRegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.register_recruiter(db, request)
        return build_user_response(user)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ---------------------------------------------------------
# T&P OFFICER ACCESS REQUEST & APPROVAL WORKFLOW
# ---------------------------------------------------------

@router.post(
    "/tp/request-access",
    response_model=TPAccessRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit T&P Officer Access Request",
)
def request_tp_access(
    request: TPAccessRequestCreate,
    db: Session = Depends(get_db),
):
    try:
        tp_request = AuthService.request_tp_access(db, request)
        return TPAccessRequestResponse.model_validate(tp_request)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/tp/requests",
    response_model=list[TPAccessRequestResponse],
    summary="List T&P Access Requests (Admin / T&P Officer)",
)
def list_tp_requests(
    status_filter: str | None = Query(default=None, alias="status"),
    current_user: User = Depends(require_roles("admin", "placement_officer", "system_administrator")),
    db: Session = Depends(get_db),
):
    requests = AuthService.list_tp_requests(db, status_filter)
    return [TPAccessRequestResponse.model_validate(r) for r in requests]


@router.post(
    "/tp/requests/{request_id}/approve",
    response_model=TPAccessRequestResponse,
    summary="Approve T&P Officer Access Request (Admin only)",
)
def approve_tp_request(
    request_id: UUID,
    current_user: User = Depends(require_roles("admin", "system_administrator")),
    db: Session = Depends(get_db),
):
    try:
        tp_req = AuthService.review_tp_access(
            db, request_id, "APPROVE", current_user
        )
        return TPAccessRequestResponse.model_validate(tp_req)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/tp/requests/{request_id}/reject",
    response_model=TPAccessRequestResponse,
    summary="Reject T&P Officer Access Request (Admin only)",
)
def reject_tp_request(
    request_id: UUID,
    current_user: User = Depends(require_roles("admin", "system_administrator")),
    db: Session = Depends(get_db),
):
    try:
        tp_req = AuthService.review_tp_access(
            db, request_id, "REJECT", current_user
        )
        return TPAccessRequestResponse.model_validate(tp_req)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# ---------------------------------------------------------
# LOGIN
# ---------------------------------------------------------

@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate User and Get JWT Token",
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        user, access_token = AuthService.login_user(db, request)

        return AuthResponse(
            user=build_user_response(user),
            tokens=TokenResponse(
                access_token=access_token,
                token_type="bearer",
                expires_in=60 * 15,
            ),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------
# CURRENT AUTHENTICATED USER
# ---------------------------------------------------------

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Authenticated User Profile",
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return build_user_response(current_user)


# ---------------------------------------------------------
# EMAIL VERIFICATION & OTP ENDPOINTS
# ---------------------------------------------------------

@router.post(
    "/verify-email",
    response_model=UserResponse,
    summary="Verify Email with 6-Digit OTP",
)
def verify_email(
    request: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    try:
        user = AuthService.verify_email(db, request)
        return build_user_response(user)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/resend-verification",
    summary="Resend Email Verification OTP",
)
def resend_verification(
    request: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    try:
        AuthService.resend_verification(db, request)
        return {"message": "Verification code has been resent to your email"}
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/forgot-password",
    summary="Request Password Reset OTP",
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    message = AuthService.forgot_password(db, request)
    return {"message": message}


@router.post(
    "/verify-otp",
    summary="Verify 6-Digit OTP Code",
)
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    try:
        AuthService.verify_otp(db, request)
        return {"message": "OTP verified successfully", "valid": True}
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post(
    "/reset-password",
    summary="Reset Password with OTP",
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    try:
        AuthService.reset_password(db, request)
        return {"message": "Password reset successfully"}
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )