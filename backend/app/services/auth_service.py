import random
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from backend.app.models.auth import Company, OTPCode, Recruiter, TPAccessRequest, User, UserRole
from backend.app.repositories.otp_repository import OTPRepository
from backend.app.repositories.recruiter_repository import RecruiterRepository
from backend.app.repositories.role_repository import RoleRepository
from backend.app.repositories.tp_access_repository import TPAccessRepository
from backend.app.repositories.user_repository import UserRepository
from backend.app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RecruiterRegisterRequest,
    RegisterRequest,
    RegistrationRole,
    ResetPasswordRequest,
    ResendVerificationRequest,
    TPAccessRequestCreate,
    VerifyEmailRequest,
    VerifyOTPRequest,
)
from backend.app.services.email_service import EmailService


def generate_6digit_otp() -> str:
    return f"{random.randint(100000, 999999)}"


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        request: RegisterRequest,
    ) -> User:
        """Student registration endpoint service."""

        # Direct self-activation of placement_officer via public registration is forbidden
        if request.role == RegistrationRole.PLACEMENT_OFFICER:
            raise ValueError(
                "Direct registration as Placement Officer is not permitted. "
                "Please submit an Institutional Access Request."
            )

        existing_user = UserRepository.get_by_email(db, request.email)
        if existing_user:
            raise ValueError("Email is already registered")

        role = RoleRepository.get_by_name(db, request.role.value)
        if role is None:
            RoleRepository.ensure_default_roles(db)
            role = RoleRepository.get_by_name(db, request.role.value)

        if role is None:
            raise ValueError(f"Role '{request.role.value}' does not exist")

        now = datetime.now(timezone.utc)
        password_hash_str = hash_password(request.password)

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            phone=request.phone,
            password_hash=password_hash_str,
            is_verified=False,
            is_active=True,
            created_at=now,
            updated_at=now,
        )

        try:
            UserRepository.create(db, user)

            user_role = UserRole(
                user_id=user.user_id,
                role_id=role.role_id,
                assigned_at=now,
            )
            db.add(user_role)
            db.flush()

            # Generate Email Verification OTP
            otp_code = generate_6digit_otp()
            OTPRepository.invalidate_active_otps(
                db, request.email, "EMAIL_VERIFICATION"
            )

            otp_record = OTPCode(
                user_id=user.user_id,
                email=request.email,
                otp_code=otp_code,
                purpose="EMAIL_VERIFICATION",
                expires_at=now + timedelta(minutes=10),
                is_used=False,
                created_at=now,
            )
            OTPRepository.create_otp(db, otp_record)

            db.commit()
            db.refresh(user)

            EmailService.send_otp_email(
                user.email, otp_code, "EMAIL_VERIFICATION"
            )

            return user

        except IntegrityError:
            db.rollback()
            raise ValueError("Email is already registered")

    @staticmethod
    def register_recruiter(
        db: Session,
        request: RecruiterRegisterRequest,
    ) -> User:
        """Recruiter registration service."""

        existing_user = UserRepository.get_by_email(
            db, request.official_email
        )
        if existing_user:
            raise ValueError("Email is already registered")

        role = RoleRepository.get_by_name(db, "recruiter")
        if role is None:
            RoleRepository.ensure_default_roles(db)
            role = RoleRepository.get_by_name(db, "recruiter")

        if role is None:
            raise ValueError("Recruiter role does not exist")

        now = datetime.now(timezone.utc)
        password_hash_str = hash_password(request.password)

        # Find or create company
        company = RecruiterRepository.get_company_by_name(
            db, request.company_name
        )
        if not company:
            company = Company(
                company_name=request.company_name,
                email=request.official_email,
                phone=request.contact_number,
                created_at=now,
                updated_at=now,
            )
            RecruiterRepository.create_company(db, company)

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.official_email,
            phone=request.contact_number,
            password_hash=password_hash_str,
            is_verified=False,
            is_active=True,
            created_at=now,
            updated_at=now,
        )

        try:
            UserRepository.create(db, user)

            user_role = UserRole(
                user_id=user.user_id,
                role_id=role.role_id,
                assigned_at=now,
            )
            db.add(user_role)
            db.flush()

            recruiter_profile = Recruiter(
                user_id=user.user_id,
                company_id=company.company_id,
                designation=request.designation,
                official_email=request.official_email,
                contact_number=request.contact_number,
                created_at=now,
                updated_at=now,
            )
            RecruiterRepository.create_recruiter(db, recruiter_profile)

            # Generate Email Verification OTP
            otp_code = generate_6digit_otp()
            OTPRepository.invalidate_active_otps(
                db, request.official_email, "EMAIL_VERIFICATION"
            )

            otp_record = OTPCode(
                user_id=user.user_id,
                email=request.official_email,
                otp_code=otp_code,
                purpose="EMAIL_VERIFICATION",
                expires_at=now + timedelta(minutes=10),
                is_used=False,
                created_at=now,
            )
            OTPRepository.create_otp(db, otp_record)

            db.commit()
            db.refresh(user)

            EmailService.send_otp_email(
                user.email, otp_code, "EMAIL_VERIFICATION"
            )

            return user

        except IntegrityError:
            db.rollback()
            raise ValueError("Email is already registered")

    @staticmethod
    def request_tp_access(
        db: Session,
        request: TPAccessRequestCreate,
    ) -> TPAccessRequest:
        """Submit an institutional T&P Officer access request."""

        existing_user = UserRepository.get_by_email(
            db, request.official_email
        )
        if existing_user:
            raise ValueError(
                "An account with this email already exists."
            )

        now = datetime.now(timezone.utc)
        tp_request = TPAccessRequest(
            first_name=request.first_name,
            last_name=request.last_name,
            official_email=request.official_email,
            contact_number=request.contact_number,
            institution_name=request.institution_name,
            designation=request.designation,
            reason_for_access=request.reason_for_access,
            status="PENDING",
            created_at=now,
            updated_at=now,
        )

        TPAccessRepository.create_request(db, tp_request)
        db.commit()
        db.refresh(tp_request)
        return tp_request

    @staticmethod
    def list_tp_requests(
        db: Session,
        status_filter: str | None = None,
    ) -> list[TPAccessRequest]:
        return TPAccessRepository.list_requests(db, status_filter)

    @staticmethod
    def review_tp_access(
        db: Session,
        request_id: uuid.UUID,
        action: str,
        reviewer: User,
    ) -> TPAccessRequest:
        """Approve or reject a T&P Officer access request."""

        tp_request = TPAccessRepository.get_by_id(db, request_id)
        if not tp_request:
            raise ValueError("T&P access request not found")

        if tp_request.status != "PENDING":
            raise ValueError(
                f"Request has already been processed with status '{tp_request.status}'"
            )

        now = datetime.now(timezone.utc)
        action_upper = action.upper()

        if action_upper == "APPROVE":
            tp_request.status = "APPROVED"
            tp_request.reviewed_by = reviewer.user_id
            tp_request.reviewed_at = now
            tp_request.updated_at = now

            # Create or activate Placement Officer user
            user = UserRepository.get_by_email(
                db, tp_request.official_email
            )
            role = RoleRepository.get_by_name(db, "placement_officer")
            if role is None:
                RoleRepository.ensure_default_roles(db)
                role = RoleRepository.get_by_name(db, "placement_officer")

            if not user:
                temp_password = f"TP_{uuid.uuid4().hex[:10]}!1"
                user = User(
                    first_name=tp_request.first_name,
                    last_name=tp_request.last_name,
                    email=tp_request.official_email,
                    phone=tp_request.contact_number,
                    password_hash=hash_password(temp_password),
                    is_verified=True,
                    is_active=True,
                    created_at=now,
                    updated_at=now,
                )
                UserRepository.create(db, user)

            # Assign Placement Officer role if not already assigned
            existing_user_roles = [
                ur.role.role_name for ur in user.user_roles
            ] if user.user_roles else []

            if "Placement Officer" not in existing_user_roles and role:
                user_role = UserRole(
                    user_id=user.user_id,
                    role_id=role.role_id,
                    assigned_at=now,
                )
                db.add(user_role)

            user.is_active = True
            user.is_verified = True
            UserRepository.update(db, user)

        elif action_upper == "REJECT":
            tp_request.status = "REJECTED"
            tp_request.reviewed_by = reviewer.user_id
            tp_request.reviewed_at = now
            tp_request.updated_at = now
        else:
            raise ValueError("Action must be 'APPROVE' or 'REJECT'")

        TPAccessRepository.update_request(db, tp_request)
        db.commit()
        db.refresh(tp_request)
        return tp_request

    @staticmethod
    def login_user(
        db: Session,
        request: LoginRequest,
    ) -> tuple[User, str]:
        """Authenticate user and issue JWT token."""

        user = UserRepository.get_by_email(db, request.email)
        if user is None:
            raise ValueError("Invalid email or password")

        if not verify_password(request.password, user.password_hash):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("User account is inactive")

        if not user.user_roles:
            raise ValueError("User has no assigned role")

        role_name = user.user_roles[0].role.role_name

        user.last_login = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user)

        access_token = create_access_token(
            subject=str(user.user_id),
            additional_claims={"role": role_name},
        )

        return user, access_token

    @staticmethod
    def verify_email(
        db: Session,
        request: VerifyEmailRequest,
    ) -> User:
        """Verify email using 6-digit OTP code."""

        user = UserRepository.get_by_email(db, request.email)
        if user is None:
            raise ValueError("User not found")

        otp_record = OTPRepository.get_valid_otp(
            db, request.email, request.otp, "EMAIL_VERIFICATION"
        )
        if not otp_record:
            raise ValueError("Invalid or expired verification code")

        user.is_verified = True
        user.email_verified_at = datetime.now(timezone.utc)
        UserRepository.update(db, user)

        OTPRepository.mark_used(db, otp_record)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def resend_verification(
        db: Session,
        request: ResendVerificationRequest,
    ) -> None:
        """Resend email verification OTP."""

        user = UserRepository.get_by_email(db, request.email)
        if user is None:
            raise ValueError("User not found")

        if user.is_verified:
            raise ValueError("Email is already verified")

        now = datetime.now(timezone.utc)
        otp_code = generate_6digit_otp()
        OTPRepository.invalidate_active_otps(
            db, request.email, "EMAIL_VERIFICATION"
        )

        otp_record = OTPCode(
            user_id=user.user_id,
            email=request.email,
            otp_code=otp_code,
            purpose="EMAIL_VERIFICATION",
            expires_at=now + timedelta(minutes=10),
            is_used=False,
            created_at=now,
        )
        OTPRepository.create_otp(db, otp_record)
        db.commit()

        EmailService.send_otp_email(
            user.email, otp_code, "EMAIL_VERIFICATION"
        )

    @staticmethod
    def forgot_password(
        db: Session,
        request: ForgotPasswordRequest,
    ) -> str:
        """Initiate password reset flow. Returns anti-enumeration message."""

        user = UserRepository.get_by_email(db, request.email)
        if user:
            now = datetime.now(timezone.utc)
            otp_code = generate_6digit_otp()
            OTPRepository.invalidate_active_otps(
                db, request.email, "PASSWORD_RESET"
            )

            otp_record = OTPCode(
                user_id=user.user_id,
                email=request.email,
                otp_code=otp_code,
                purpose="PASSWORD_RESET",
                expires_at=now + timedelta(minutes=10),
                is_used=False,
                created_at=now,
            )
            OTPRepository.create_otp(db, otp_record)
            db.commit()

            EmailService.send_otp_email(
                user.email, otp_code, "PASSWORD_RESET"
            )

        return "If the account exists, a password reset code has been sent."

    @staticmethod
    def verify_otp(
        db: Session,
        request: VerifyOTPRequest,
    ) -> bool:
        """Verify 6-digit OTP for email verification or password reset."""

        otp_record = OTPRepository.get_valid_otp(
            db, request.email, request.otp, request.purpose
        )
        if not otp_record:
            raise ValueError("Invalid or expired OTP code")
        return True

    @staticmethod
    def reset_password(
        db: Session,
        request: ResetPasswordRequest,
    ) -> None:
        """Reset user password using OTP."""

        otp_record = OTPRepository.get_valid_otp(
            db, request.email, request.otp, "PASSWORD_RESET"
        )
        if not otp_record:
            raise ValueError("Invalid or expired password reset code")

        user = UserRepository.get_by_email(db, request.email)
        if not user:
            raise ValueError("User not found")

        now = datetime.now(timezone.utc)
        user.password_hash = hash_password(request.new_password)
        user.password_changed_at = now
        UserRepository.update(db, user)

        OTPRepository.mark_used(db, otp_record)
        db.commit()