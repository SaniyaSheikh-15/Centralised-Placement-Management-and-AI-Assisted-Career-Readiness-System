"""
eligibility_rule_repository.py
Database query layer for eligibility_rules table.
"""

from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.placement_drive import EligibilityRule


class EligibilityRuleRepository:

    @staticmethod
    def get_by_drive(
        db: Session,
        drive_id: UUID,
    ) -> EligibilityRule | None:

        return (
            db.query(EligibilityRule)
            .filter(EligibilityRule.drive_id == drive_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        rule: EligibilityRule,
    ) -> EligibilityRule:

        db.add(rule)
        db.commit()
        db.refresh(rule)

        return rule

    @staticmethod
    def update(
        db: Session,
        rule: EligibilityRule,
    ) -> EligibilityRule:

        db.commit()
        db.refresh(rule)

        return rule

    @staticmethod
    def delete(
        db: Session,
        rule: EligibilityRule,
    ) -> None:

        db.delete(rule)
        db.commit()
