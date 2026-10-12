"""
placement_drive_service.py
Business logic for Placement Drive Management.
Handles CRUD operations, status transitions, eligibility rules,
drive branches, and drive skills.
"""

from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.placement_drive import (
    DRIVE_STATUS_TRANSITIONS,
    DriveBranch,
    DriveSkill,
    EligibilityRule,
    PlacementDrive,
)
from backend.app.repositories.drive_branch_repository import (
    DriveBranchRepository,
)
from backend.app.repositories.drive_skill_repository import (
    DriveSkillRepository,
)
from backend.app.repositories.eligibility_rule_repository import (
    EligibilityRuleRepository,
)
from backend.app.repositories.placement_drive_repository import (
    PlacementDriveRepository,
)
from backend.app.schemas.placement_drive import (
    DriveSkillCreate,
    DriveStatusUpdate,
    EligibilityRuleCreate,
    EligibilityRuleUpdate,
    PlacementDriveCreate,
    PlacementDriveUpdate,
)


class PlacementDriveService:
    """
    Service layer for placement drive business logic.
    Follows the same static-method pattern as StudentService.
    """

    # ---------------------------------------------------------
    # PLACEMENT DRIVE CRUD
    # ---------------------------------------------------------

    @staticmethod
    def create_drive(
        db: Session,
        request: PlacementDriveCreate,
    ) -> PlacementDrive:

        now = datetime.utcnow()

        drive = PlacementDrive(
            company_id=request.company_id,
            recruiter_id=request.recruiter_id,
            job_role_id=request.job_role_id,
            drive_title=request.drive_title,
            job_description=request.job_description,
            employment_type=request.employment_type,
            work_mode=request.work_mode,
            location=request.location,
            minimum_package_lpa=request.minimum_package_lpa,
            maximum_package_lpa=request.maximum_package_lpa,
            vacancies=request.vacancies,
            registration_deadline=request.registration_deadline,
            drive_date=request.drive_date,
            status=request.status or "upcoming",
            created_at=now,
            updated_at=now,
        )

        db.add(drive)
        db.flush()  # Get drive_id before creating child records

        # ─── Optional: Create eligibility rules inline ──────────
        if request.eligibility:
            eligibility = EligibilityRule(
                drive_id=drive.drive_id,
                minimum_cgpa=request.eligibility.minimum_cgpa,
                maximum_backlogs=request.eligibility.maximum_backlogs,
                graduation_year=request.eligibility.graduation_year,
                minimum_tenth_percentage=request.eligibility.minimum_tenth_percentage,
                minimum_twelfth_percentage=request.eligibility.minimum_twelfth_percentage,
                created_at=now,
            )
            db.add(eligibility)

        # ─── Optional: Add eligible branches inline ─────────────
        if request.branch_ids:
            for branch_id in request.branch_ids:
                drive_branch = DriveBranch(
                    drive_id=drive.drive_id,
                    branch_id=branch_id,
                )
                db.add(drive_branch)

        # ─── Optional: Add required skills inline ───────────────
        if request.skill_requirements:
            for skill_req in request.skill_requirements:
                drive_skill = DriveSkill(
                    drive_id=drive.drive_id,
                    skill_id=skill_req.skill_id,
                    minimum_proficiency=skill_req.minimum_proficiency,
                )
                db.add(drive_skill)

        db.commit()
        db.refresh(drive)

        return drive

    @staticmethod
    def get_drives(
        db: Session,
        page: int = 1,
        page_size: int = 20,
        status: str | None = None,
        company_id: UUID | None = None,
    ) -> tuple[list[PlacementDrive], int]:

        skip = (page - 1) * page_size

        drives = PlacementDriveRepository.get_all(
            db,
            skip=skip,
            limit=page_size,
            status_filter=status,
            company_id_filter=company_id,
        )

        total = PlacementDriveRepository.count(
            db,
            status_filter=status,
            company_id_filter=company_id,
        )

        return drives, total

    @staticmethod
    def get_drive_by_id(
        db: Session,
        drive_id: UUID,
    ) -> PlacementDrive:

        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        return drive

    @staticmethod
    def update_drive(
        db: Session,
        drive_id: UUID,
        request: PlacementDriveUpdate,
    ) -> PlacementDrive:

        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        update_data = request.model_dump(
            exclude_unset=True,
        )

        for field, value in update_data.items():
            setattr(drive, field, value)

        drive.updated_at = datetime.utcnow()

        return PlacementDriveRepository.update(
            db,
            drive,
        )

    @staticmethod
    def delete_drive(
        db: Session,
        drive_id: UUID,
    ) -> None:

        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        PlacementDriveRepository.delete(
            db,
            drive,
        )

    # ---------------------------------------------------------
    # STATUS MANAGEMENT
    # ---------------------------------------------------------

    @staticmethod
    def update_status(
        db: Session,
        drive_id: UUID,
        request: DriveStatusUpdate,
    ) -> PlacementDrive:

        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        current_status = drive.status or "upcoming"
        new_status = request.status

        # Validate status transition
        allowed_transitions = DRIVE_STATUS_TRANSITIONS.get(
            current_status, []
        )

        if new_status not in allowed_transitions:
            raise ValueError(
                f"Cannot transition from '{current_status}' to "
                f"'{new_status}'. Allowed transitions: "
                f"{', '.join(allowed_transitions) or 'none'}"
            )

        drive.status = new_status
        drive.updated_at = datetime.utcnow()

        return PlacementDriveRepository.update(
            db,
            drive,
        )

    # ---------------------------------------------------------
    # ELIGIBILITY RULES
    # ---------------------------------------------------------

    @staticmethod
    def get_eligibility(
        db: Session,
        drive_id: UUID,
    ) -> EligibilityRule | None:

        return EligibilityRuleRepository.get_by_drive(
            db,
            drive_id,
        )

    @staticmethod
    def set_eligibility(
        db: Session,
        drive_id: UUID,
        request: EligibilityRuleCreate,
    ) -> EligibilityRule:

        # Verify drive exists
        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        # Check if eligibility already exists (update) or create new
        existing = EligibilityRuleRepository.get_by_drive(
            db,
            drive_id,
        )

        if existing:
            update_data = request.model_dump(
                exclude_unset=True,
            )

            for field, value in update_data.items():
                setattr(existing, field, value)

            return EligibilityRuleRepository.update(
                db,
                existing,
            )

        rule = EligibilityRule(
            drive_id=drive_id,
            minimum_cgpa=request.minimum_cgpa,
            maximum_backlogs=request.maximum_backlogs,
            graduation_year=request.graduation_year,
            minimum_tenth_percentage=request.minimum_tenth_percentage,
            minimum_twelfth_percentage=request.minimum_twelfth_percentage,
            created_at=datetime.utcnow(),
        )

        return EligibilityRuleRepository.create(
            db,
            rule,
        )

    # ---------------------------------------------------------
    # DRIVE BRANCHES
    # ---------------------------------------------------------

    @staticmethod
    def get_branches(
        db: Session,
        drive_id: UUID,
    ) -> list[DriveBranch]:

        return DriveBranchRepository.get_by_drive(
            db,
            drive_id,
        )

    @staticmethod
    def add_branch(
        db: Session,
        drive_id: UUID,
        branch_id: UUID,
    ) -> DriveBranch:

        # Verify drive exists
        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        # Check for duplicate
        existing = DriveBranchRepository.get_by_drive_and_branch(
            db,
            drive_id,
            branch_id,
        )

        if existing:
            raise ValueError(
                "This branch is already added to the drive"
            )

        drive_branch = DriveBranch(
            drive_id=drive_id,
            branch_id=branch_id,
        )

        return DriveBranchRepository.create(
            db,
            drive_branch,
        )

    @staticmethod
    def remove_branch(
        db: Session,
        drive_id: UUID,
        branch_id: UUID,
    ) -> None:

        drive_branch = DriveBranchRepository.get_by_drive_and_branch(
            db,
            drive_id,
            branch_id,
        )

        if not drive_branch:
            raise ValueError(
                "Branch not found for this drive"
            )

        DriveBranchRepository.delete(
            db,
            drive_branch,
        )

    # ---------------------------------------------------------
    # DRIVE SKILLS
    # ---------------------------------------------------------

    @staticmethod
    def get_skills(
        db: Session,
        drive_id: UUID,
    ) -> list[DriveSkill]:

        return DriveSkillRepository.get_by_drive(
            db,
            drive_id,
        )

    @staticmethod
    def add_skill(
        db: Session,
        drive_id: UUID,
        request: DriveSkillCreate,
    ) -> DriveSkill:

        # Verify drive exists
        drive = PlacementDriveRepository.get_by_id(
            db,
            drive_id,
        )

        if not drive:
            raise ValueError("Placement drive not found")

        # Check for duplicate
        existing = DriveSkillRepository.get_by_drive_and_skill(
            db,
            drive_id,
            request.skill_id,
        )

        if existing:
            raise ValueError(
                "This skill is already added to the drive"
            )

        drive_skill = DriveSkill(
            drive_id=drive_id,
            skill_id=request.skill_id,
            minimum_proficiency=request.minimum_proficiency,
        )

        return DriveSkillRepository.create(
            db,
            drive_skill,
        )

    @staticmethod
    def remove_skill(
        db: Session,
        drive_id: UUID,
        skill_id: UUID,
    ) -> None:

        drive_skill = DriveSkillRepository.get_by_drive_and_skill(
            db,
            drive_id,
            skill_id,
        )

        if not drive_skill:
            raise ValueError(
                "Skill not found for this drive"
            )

        DriveSkillRepository.delete(
            db,
            drive_skill,
        )
