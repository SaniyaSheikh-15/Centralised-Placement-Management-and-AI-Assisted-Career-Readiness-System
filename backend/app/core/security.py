from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    JWT_ALGORITHM,
    JWT_SECRET_KEY,
)
from backend.app.db.session import get_db
from backend.app.repositories.user_repository import UserRepository


# ---------------------------------------------------------
# HTTP Bearer Authentication
# ---------------------------------------------------------

security = HTTPBearer()


# ---------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")

    salt = bcrypt.gensalt()

    hashed_password = bcrypt.hashpw(
        password_bytes,
        salt,
    )

    return hashed_password.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


# ---------------------------------------------------------
# JWT Token Creation
# ---------------------------------------------------------

def create_access_token(
    subject: str,
    additional_claims: dict[str, Any] | None = None,
) -> str:

    now = datetime.now(timezone.utc)

    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": now
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }

    if additional_claims:
        payload.update(additional_claims)

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


# ---------------------------------------------------------
# JWT Token Decoding
# ---------------------------------------------------------

def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        JWT_SECRET_KEY,
        algorithms=[JWT_ALGORITHM],
    )


def get_current_user(*args, **kwargs):
    from backend.app.core.dependencies import get_current_user as _get_current_user
    return _get_current_user(*args, **kwargs)
