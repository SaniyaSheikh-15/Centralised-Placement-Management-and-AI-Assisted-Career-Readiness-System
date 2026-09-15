from sqlalchemy.orm import Session

from backend.app.models.student import Branch


class BranchRepository:

    @staticmethod
    def get_all(db: Session) -> list[Branch]:
        return (
            db.query(Branch)
            .order_by(Branch.branch_name.asc())
            .all()
        )