from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.auth import TPAccessRequest


class TPAccessRepository:

    @staticmethod
    def create_request(
        db: Session,
        tp_request: TPAccessRequest,
    ) -> TPAccessRequest:
        db.add(tp_request)
        db.flush()
        return tp_request

    @staticmethod
    def get_by_id(
        db: Session,
        request_id: UUID,
    ) -> TPAccessRequest | None:
        statement = select(TPAccessRequest).where(
            TPAccessRequest.request_id == request_id
        )
        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def get_pending_by_email(
        db: Session,
        email: str,
    ) -> TPAccessRequest | None:
        statement = select(TPAccessRequest).where(
            TPAccessRequest.official_email == email,
            TPAccessRequest.status == "PENDING",
        )
        return db.execute(statement).scalars().first()

    @staticmethod
    def list_requests(
        db: Session,
        status: str | None = None,
    ) -> list[TPAccessRequest]:
        statement = select(TPAccessRequest)
        if status:
            statement = statement.where(
                TPAccessRequest.status == status
            )
        statement = statement.order_by(
            TPAccessRequest.created_at.desc()
        )
        return list(db.execute(statement).scalars().all())

    @staticmethod
    def update_request(
        db: Session,
        tp_request: TPAccessRequest,
    ) -> TPAccessRequest:
        db.add(tp_request)
        db.flush()
        return tp_request
