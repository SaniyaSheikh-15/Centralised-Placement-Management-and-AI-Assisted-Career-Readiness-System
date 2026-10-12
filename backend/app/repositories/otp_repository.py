from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from backend.app.models.auth import OTPCode


class OTPRepository:

    @staticmethod
    def create_otp(
        db: Session,
        otp_record: OTPCode,
    ) -> OTPCode:
        db.add(otp_record)
        db.flush()
        return otp_record

    @staticmethod
    def invalidate_active_otps(
        db: Session,
        email: str,
        purpose: str,
    ) -> None:
        statement = (
            update(OTPCode)
            .where(
                OTPCode.email == email,
                OTPCode.purpose == purpose,
                OTPCode.is_used == False,  # noqa: E712
            )
            .values(is_used=True)
        )
        db.execute(statement)
        db.flush()

    @staticmethod
    def get_valid_otp(
        db: Session,
        email: str,
        otp_code: str,
        purpose: str,
    ) -> OTPCode | None:
        now = datetime.now(timezone.utc)
        statement = select(OTPCode).where(
            OTPCode.email == email,
            OTPCode.otp_code == otp_code,
            OTPCode.purpose == purpose,
            OTPCode.is_used == False,  # noqa: E712
            OTPCode.expires_at > now,
        ).order_by(OTPCode.created_at.desc())

        return db.execute(statement).scalars().first()

    @staticmethod
    def mark_used(
        db: Session,
        otp_record: OTPCode,
    ) -> None:
        otp_record.is_used = True
        db.add(otp_record)
        db.flush()
