"""Authentication service.

Resolves a user + their RBAC roles from the platform tables and issues/validates
the JWT pair. Kept separate from the API layer so both the auth router and the
``get_current_user`` dependency share one implementation.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AuthenticationError
from app.core.logging_config import get_logger
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
)
from app.db.models import RefreshToken, Role, StudentProfile, User, UserRole

logger = get_logger(__name__)


class AuthenticatedIdentity:
    """Lightweight value object describing the authenticated caller."""

    def __init__(
        self,
        *,
        user_id: uuid.UUID,
        email: str,
        full_name: str,
        roles: list[str],
        student_id: uuid.UUID | None,
        is_active: bool,
    ) -> None:
        self.user_id = user_id
        self.email = email
        self.full_name = full_name
        self.roles = roles
        self.student_id = student_id
        self.is_active = is_active

    @property
    def is_student(self) -> bool:
        return "Student" in self.roles

    @property
    def is_privileged(self) -> bool:
        """Officers/admins may act on behalf of any student."""
        return bool({"Placement Officer", "System Administrator"} & set(self.roles))


async def _load_roles(db: AsyncSession, user_id: uuid.UUID) -> list[str]:
    """Return the role names assigned to ``user_id``."""
    stmt = (
        select(Role.role_name)
        .join(UserRole, UserRole.role_id == Role.role_id)
        .where(UserRole.user_id == user_id)
    )
    return list((await db.execute(stmt)).scalars().all())


async def load_identity(db: AsyncSession, user_id: uuid.UUID) -> AuthenticatedIdentity:
    """Load a full identity (roles + linked student profile) for ``user_id``."""
    user = await db.get(User, user_id)
    if user is None:
        raise AuthenticationError("User account no longer exists.")
    if not user.is_active:
        raise AuthenticationError("User account is inactive.")

    roles = await _load_roles(db, user_id)
    student = (
        await db.execute(
            select(StudentProfile.student_id).where(StudentProfile.user_id == user_id)
        )
    ).scalars().first()

    return AuthenticatedIdentity(
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        roles=roles,
        student_id=student,
        is_active=user.is_active,
    )


async def authenticate(db: AsyncSession, email: str, password: str) -> User:
    """Verify credentials and return the user, or raise ``AuthenticationError``."""
    user = (
        await db.execute(select(User).where(User.email == email))
    ).scalars().first()
    # Verify even when the user is missing to avoid user-enumeration timing leaks.
    stored_hash = user.password_hash if user else ""
    if not user or not verify_password(password, stored_hash):
        raise AuthenticationError("Invalid email or password.")
    if not user.is_active:
        raise AuthenticationError("User account is inactive.")

    user.last_login = datetime.now(timezone.utc)
    await db.flush()
    return user


async def issue_tokens(db: AsyncSession, user: User) -> tuple[str, str, int]:
    """Issue an access + refresh token pair for ``user``.

    Persists the refresh token so it can be revoked. Returns
    ``(access_token, refresh_token, expires_in_seconds)``.
    """
    roles = await _load_roles(db, user.user_id)
    access_token = create_access_token(
        str(user.user_id),
        role=roles[0] if roles else None,
        extra_claims={"roles": roles, "email": user.email},
    )
    refresh_token = create_refresh_token(str(user.user_id))

    db.add(
        RefreshToken(
            user_id=user.user_id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    await db.flush()

    expires_in = settings.access_token_expire_minutes * 60
    return access_token, refresh_token, expires_in


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Look up a user by email (used by the dev-login flow)."""
    return (await db.execute(select(User).where(User.email == email))).scalars().first()
