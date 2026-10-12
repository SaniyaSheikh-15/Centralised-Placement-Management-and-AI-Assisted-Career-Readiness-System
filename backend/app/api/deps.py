"""Shared FastAPI dependencies: database session, authentication and RBAC.

The PRD requires every endpoint to be secured with the platform's JWT scheme
and to enforce that students only ever access their own data. These dependencies
centralise that policy so routers stay thin and consistent.
"""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AuthenticationError, PermissionDeniedError
from app.core.security import decode_token
from app.db.session import get_db
from app.services.auth_service import AuthenticatedIdentity, load_identity

# ``auto_error=False`` lets us raise our own consistent error envelope.
_bearer = HTTPBearer(auto_error=False, description="JWT access token (Bearer).")

DbSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_identity(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(_bearer)],
) -> AuthenticatedIdentity:
    """Resolve the caller from the ``Authorization: Bearer <jwt>`` header."""
    if credentials is None or not credentials.credentials:
        raise AuthenticationError("Missing bearer token.")

    payload = decode_token(credentials.credentials, expected_type="access")
    try:
        user_id = uuid.UUID(str(payload["sub"]))
    except (ValueError, KeyError) as exc:
        raise AuthenticationError("Token subject is not a valid user id.") from exc

    return await load_identity(db, user_id)


CurrentIdentity = Annotated[AuthenticatedIdentity, Depends(get_current_identity)]


def require_roles(*allowed_roles: str):
    """Return a dependency that restricts access to the given roles.

    Usage::

        @router.get("/admin", dependencies=[Depends(require_roles("System Administrator"))])
    """

    async def _guard(identity: CurrentIdentity) -> AuthenticatedIdentity:
        if not set(allowed_roles) & set(identity.roles):
            raise PermissionDeniedError(
                "You do not have permission to perform this action."
            )
        return identity

    return _guard


async def resolve_student_id(
    identity: CurrentIdentity,
    requested_student_id: uuid.UUID | None = None,
) -> uuid.UUID:
    """Return the student id the caller is allowed to act on.

    * A **student** may only act as themselves (``requested_student_id`` is
      ignored/validated against their own profile).
    * A **privileged** user (Placement Officer / System Administrator) may act
      on behalf of any student by supplying ``requested_student_id``.

    Raises
    ------
    PermissionDeniedError
        If a student asks for another student's data, or a privileged caller
        omits the student id.
    """
    if identity.is_privileged:
        if requested_student_id is None:
            raise PermissionDeniedError(
                "A student id is required when acting on behalf of a student."
            )
        return requested_student_id

    if identity.student_id is None:
        raise PermissionDeniedError("This account is not linked to a student profile.")

    if requested_student_id is not None and requested_student_id != identity.student_id:
        raise PermissionDeniedError("You may only access your own data.")

    return identity.student_id
