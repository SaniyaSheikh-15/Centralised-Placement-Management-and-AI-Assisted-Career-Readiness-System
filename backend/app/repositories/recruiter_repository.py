from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.auth import Company, Recruiter


class RecruiterRepository:

    @staticmethod
    def get_company_by_name(
        db: Session,
        company_name: str,
    ) -> Company | None:
        statement = select(Company).where(
            Company.company_name == company_name
        )
        return db.execute(statement).scalars().first()

    @staticmethod
    def create_company(
        db: Session,
        company: Company,
    ) -> Company:
        db.add(company)
        db.flush()
        return company

    @staticmethod
    def create_recruiter(
        db: Session,
        recruiter: Recruiter,
    ) -> Recruiter:
        db.add(recruiter)
        db.flush()
        return recruiter

    @staticmethod
    def get_recruiter_by_user_id(
        db: Session,
        user_id: UUID,
    ) -> Recruiter | None:
        statement = select(Recruiter).where(
            Recruiter.user_id == user_id
        )
        return db.execute(statement).scalar_one_or_none()
