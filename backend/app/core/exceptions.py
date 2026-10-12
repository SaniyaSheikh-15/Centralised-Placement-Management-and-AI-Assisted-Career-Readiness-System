"""Domain-level exceptions and their HTTP mapping.

Keeping error semantics in one module means API routers can ``raise
NotFoundError(...)`` and get a consistent JSON error envelope, rather than each
endpoint inventing its own status codes.
"""

from __future__ import annotations

from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppError(Exception):
    """Base class for all expected, client-facing application errors."""

    status_code: int = status.HTTP_400_BAD_REQUEST
    code: str = "app_error"

    def __init__(self, message: str, *, code: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        if code:
            self.code = code


class NotFoundError(AppError):
    """A requested resource does not exist (or is not visible to the caller)."""

    status_code = status.HTTP_404_NOT_FOUND
    code = "not_found"


class ValidationError(AppError):
    """Request data is syntactically valid but semantically wrong."""

    # NOTE: newer Starlette renamed the constant; 422 is the same code either way.
    status_code = 422
    code = "validation_error"


class PermissionDeniedError(AppError):
    """The caller is authenticated but not allowed to perform the action."""

    status_code = status.HTTP_403_FORBIDDEN
    code = "permission_denied"


class AuthenticationError(AppError):
    """Missing/expired/invalid credentials."""

    status_code = status.HTTP_401_UNAUTHORIZED
    code = "authentication_error"


class AIProviderError(AppError):
    """The upstream AI provider failed or returned unusable output."""

    status_code = status.HTTP_502_BAD_GATEWAY
    code = "ai_provider_error"


class ConflictError(AppError):
    """The request conflicts with current state (e.g. session already finished)."""

    status_code = status.HTTP_409_CONFLICT
    code = "conflict"


async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    """Translate :class:`AppError` into a uniform JSON error payload."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message}},
    )
