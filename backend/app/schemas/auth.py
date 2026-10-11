import re
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain at least one number")
    return v


class RegistrationRole(str, Enum):
    STUDENT = "student"
    RECRUITER = "recruiter"
    PLACEMENT_OFFICER = "placement_officer"


class RegisterRequest(BaseModel):
    first_name: str = Field(
        min_length=2,
        max_length=100,
    )

    last_name: str | None = Field(
        default=None,
        max_length=100,
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        max_length=20,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    role: RegistrationRole = RegistrationRole.STUDENT

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return validate_password_strength(v)


class RecruiterRegisterRequest(BaseModel):
    company_name: str = Field(min_length=2, max_length=200)
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    designation: str | None = Field(default=None, max_length=100)
    official_email: EmailStr
    contact_number: str | None = Field(default=None, max_length=20)
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str | None = Field(default=None)
    terms_accepted: bool = True

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return validate_password_strength(v)

    @model_validator(mode="after")
    def check_passwords_match(self) -> "RecruiterRegisterRequest":
        if self.confirm_password is not None and self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class TPAccessRequestCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    official_email: EmailStr
    contact_number: str | None = Field(default=None, max_length=20)
    institution_name: str = Field(min_length=2, max_length=200)
    designation: str | None = Field(default=None, max_length=100)
    reason_for_access: str | None = Field(default=None)


class TPAccessRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    request_id: UUID
    first_name: str
    last_name: str | None
    official_email: EmailStr
    contact_number: str | None
    institution_name: str
    designation: str | None
    reason_for_access: str | None
    status: str
    created_at: datetime


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128,
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    first_name: str
    last_name: str | None
    email: EmailStr
    phone: str | None
    is_verified: bool
    is_active: bool
    role: str | None = None


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)
    purpose: str = "PASSWORD_RESET"


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str | None = Field(default=None)

    @field_validator("new_password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return validate_password_strength(v)

    @model_validator(mode="after")
    def check_passwords_match(self) -> "ResetPasswordRequest":
        if self.confirm_password is not None and self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self