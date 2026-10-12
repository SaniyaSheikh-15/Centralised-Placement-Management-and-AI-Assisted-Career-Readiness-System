"""Security primitives: password hashing, JWT issue/verify.

The PRD's non-functional requirements demand that all AI endpoints be secured
with the platform's existing **JWT + refresh token** setup and that RBAC keeps
students scoped to their own data. This module provides the cryptographic
building blocks; the FastAPI dependencies in ``app.api.deps`` enforce the
policy.
"""

from __future__ import annotations

import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings
from app.core.exceptions import AuthenticationError

# We deliberately use the standard library (PBKDF2-HMAC-SHA256) instead of an
# extra dependency. It is battle-tested, FIPS-friendly and sufficient for the
# demo/seed accounts this service manages.
_PBKDF2_ITERATIONS = 240_000
_PBKDF2_SALT_BYTES = 16


def hash_password(password: str) -> str:
    """Return a salted PBKDF2 hash encoded as ``pbkdf2_sha256$iter$salt$hash``."""
    salt = os.urandom(_PBKDF2_SALT_BYTES)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, _PBKDF2_ITERATIONS
    )
    return f"pbkdf2_sha256${_PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    """Constant-time verification of ``password`` against an encoded hash."""
    try:
        algorithm, iterations, salt_hex, digest_hex = encoded.split("$")
    except ValueError:
        return False
    if algorithm != "pbkdf2_sha256":
        return False

    expected = bytes.fromhex(digest_hex)
    computed = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
    )
    # hmac.compare_digest avoids leaking timing information.
    return hmac.compare_digest(expected, computed)


def _create_token(
    subject: str,
    *,
    token_type: str,
    expires_delta: timedelta,
    extra_claims: dict[str, Any] | None = None,
) -> str:
    """Create a signed JWT with the standard ``sub``/``exp``/``type`` claims."""
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(
    subject: str, *, role: str | None = None, extra_claims: dict[str, Any] | None = None
) -> str:
    """Issue a short-lived access token for ``subject`` (the user id)."""
    claims = dict(extra_claims or {})
    if role:
        claims["role"] = role
    return _create_token(
        subject,
        token_type="access",
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        extra_claims=claims,
    )


def create_refresh_token(subject: str) -> str:
    """Issue a long-lived refresh token for ``subject``."""
    return _create_token(
        subject,
        token_type="refresh",
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )


def decode_token(token: str, *, expected_type: str = "access") -> dict[str, Any]:
    """Decode and validate a JWT, raising :class:`AuthenticationError` on failure."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Token has expired.") from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationError("Invalid authentication token.") from exc

    if payload.get("type") != expected_type:
        raise AuthenticationError(f"Expected a {expected_type} token.")
    if not payload.get("sub"):
        raise AuthenticationError("Token is missing a subject claim.")
    return payload
