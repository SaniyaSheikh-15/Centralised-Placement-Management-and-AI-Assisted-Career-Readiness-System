"""Authentication schemas.

The platform already owns identity; this backend verifies JWTs and (in
development) can mint tokens for seeded accounts so Swagger UI can exercise the
RBAC-protected AI endpoints.
"""

from __future__ import annotations

from uuid import UUID

from pydantic import EmailStr, Field

from app.schemas.common import CamelModel


class LoginRequest(CamelModel):
    """Body for ``POST /auth/login``."""

    email: EmailStr
    password: str = Field(min_length=1)


class DevLoginRequest(CamelModel):
    """Body for ``POST /auth/dev-login`` (development only)."""

    email: EmailStr = Field(description="Email of a seeded demo account.")
    role: str | None = Field(
        default=None, description="Optional role override for testing RBAC (Student/Officer)."
    )


class RefreshRequest(CamelModel):
    """Body for ``POST /auth/refresh``."""

    refresh_token: str = Field(min_length=1)


class TokenResponse(CamelModel):
    """Issued JWT pair."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access-token lifetime in seconds.")


class AuthenticatedUser(CamelModel):
    """The identity resolved from a bearer token."""

    user_id: UUID
    email: EmailStr
    full_name: str
    roles: list[str]
    student_id: UUID | None = Field(
        default=None, description="Linked student profile id, when the user is a student."
    )
