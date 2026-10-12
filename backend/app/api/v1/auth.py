"""Authentication endpoints.

The platform's real login lives in the existing auth service; these endpoints
mirror its contract (JWT access + refresh) and add a development-only helper so
Swagger UI can obtain tokens for the seeded demo accounts.
"""

from __future__ import annotations

import uuid

from fastapi import APIRouter, status
from sqlalchemy import select

from app.api.deps import CurrentIdentity, DbSession
from app.core.config import settings
from app.core.exceptions import AuthenticationError, NotFoundError
from app.core.security import decode_token
from app.db.models import RefreshToken, User
from app.schemas.auth import (
    AuthenticatedUser,
    DevLoginRequest,
    LoginRequest,
    RefreshRequest,
    TokenResponse,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _to_token_response(access: str, refresh: str, expires_in: int) -> TokenResponse:
    return TokenResponse(access_token=access, refresh_token=refresh, expires_in=expires_in)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Log in with email + password",
)
async def login(payload: LoginRequest, db: DbSession) -> TokenResponse:
    """Authenticate with credentials and return a JWT pair."""
    user = await auth_service.authenticate(db, payload.email, payload.password)
    access, refresh, expires_in = await auth_service.issue_tokens(db, user)
    await db.commit()
    return _to_token_response(access, refresh, expires_in)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Exchange a refresh token for a new pair",
)
async def refresh(payload: RefreshRequest, db: DbSession) -> TokenResponse:
    """Rotate a refresh token: validate, revoke the old one, issue a new pair."""
    claims = decode_token(payload.refresh_token, expected_type="refresh")

    stored = (
        await db.execute(
            select(RefreshToken).where(RefreshToken.token == payload.refresh_token)
        )
    ).scalars().first()
    if stored is None or stored.revoked:
        raise AuthenticationError("Refresh token is invalid or has been revoked.")

    user = await db.get(User, uuid.UUID(str(claims["sub"])))
    if user is None or not user.is_active:
        raise AuthenticationError("User account is unavailable.")

    # Rotate: revoke the presented token, then issue a fresh pair.
    stored.revoked = True
    access, refresh_token, expires_in = await auth_service.issue_tokens(db, user)
    await db.commit()
    return _to_token_response(access, refresh_token, expires_in)


@router.post(
    "/dev-login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="[dev] Issue a token for a seeded demo account",
)
async def dev_login(payload: DevLoginRequest, db: DbSession) -> TokenResponse:
    """Development helper: mint a token for a seeded account (no password).

    Disabled unless ``ENABLE_DEV_AUTH=true`` so it can never be exploited in
    production.
    """
    if not settings.enable_dev_auth:
        raise NotFoundError("Development login is disabled.")

    user = await auth_service.get_user_by_email(db, payload.email)
    if user is None:
        raise AuthenticationError("No seeded account exists for that email.")

    access, refresh_token, expires_in = await auth_service.issue_tokens(db, user)
    await db.commit()
    return _to_token_response(access, refresh_token, expires_in)


@router.get(
    "/me",
    response_model=AuthenticatedUser,
    summary="Return the authenticated caller's identity",
)
async def me(identity: CurrentIdentity) -> AuthenticatedUser:
    """Return the resolved identity for the current bearer token."""
    return AuthenticatedUser(
        user_id=identity.user_id,
        email=identity.email,
        full_name=identity.full_name,
        roles=identity.roles,
        student_id=identity.student_id,
    )
