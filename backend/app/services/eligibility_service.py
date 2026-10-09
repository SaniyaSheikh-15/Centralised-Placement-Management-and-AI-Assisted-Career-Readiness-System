
from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.repositories.placement_drive_repository import (
    PlacementDriveRepository,
)
from backend.app.schemas.eligibility import (
    EligibilityCriterionResult,
    EligibilityEvaluationResponse,
)
from backend.app.services.student_service import StudentService



class EligibilityService:
    """Evaluate a student's profile against a placement drive's rules."""

    PROFICIENCY_RANK = {
        "beginner": 1,
        "intermediate": 2,
        "advanced": 3,
    }

    @staticmethod
    def _add_result(
        results: list[EligibilityCriterionResult],
        criterion: str,
        passed: bool,
        message: str,
    ) -> None:
        results.append(
            EligibilityCriterionResult(
                criterion=criterion,
                passed=passed,
                message=message,
            )
        )

    @staticmethod
    def evaluate(
        db: Session,
        drive_id: UUID,
        user_id: UUID,
    ) -> EligibilityEvaluationResponse:
        drive = PlacementDriveRepository.get_by_id(db, drive_id)

        if not drive:
            raise ValueError("Placement drive not found")

        profile = StudentService.get_profile_by_user_id(db, user_id)

        if not profile:
            raise ValueError("Student profile not found")

        results: list[EligibilityCriterionResult] = []
        rules = drive.eligibility_rule

        # Academic criteria: evaluate only configured requirements.
        academic_criteria = [
            (
                "minimum_cgpa",
                rules.minimum_cgpa if rules else None,
                profile.cgpa,
                lambda actual, required: actual >= required,
                "CGPA",
            ),
            (
                "maximum_backlogs",
                rules.maximum_backlogs if rules else None,
                profile.active_backlogs,
                lambda actual, required: actual <= required,
                "Active backlogs",
            ),
            (
                "graduation_year",
                rules.graduation_year if rules else None,
                profile.graduation_year,
                lambda actual, required: actual == required,
                "Graduation year",
            ),
            (
                "minimum_tenth_percentage",
                rules.minimum_tenth_percentage if rules else None,
                profile.ssc_percentage,
                lambda actual, required: actual >= required,
                "10th percentage",
            ),
            (
                "minimum_twelfth_percentage",
                rules.minimum_twelfth_percentage if rules else None,
                profile.hsc_diploma_percentage,
                lambda actual, required: actual >= required,
                "12th/diploma percentage",
            ),
        ]

        for key, required, actual, comparison, label in academic_criteria:
            if required is None:
                continue

            passed = actual is not None and comparison(actual, required)

            if actual is None:
                message = f"{label} is missing from your profile."
            elif passed:
                message = f"{label} meets the requirement ({required})."
            else:
                message = f"{label} does not meet the requirement ({required})."

            EligibilityService._add_result(
                results,
                key,
                passed,
                message,
            )

        # Branch eligibility: if branches are configured, one must match.
        allowed_branch_ids = {
            item.branch_id for item in drive.drive_branches
        }

        if allowed_branch_ids:
            passed = (
                profile.branch_id is not None
                and profile.branch_id in allowed_branch_ids
            )
            EligibilityService._add_result(
                results,
                "branch",
                passed,
                (
                    "Your branch is eligible for this drive."
                    if passed
                    else "Your branch is not eligible or is missing."
                ),
            )


        # Skills: every configured drive skill is required.
        if drive.drive_skills:
            student_skills = StudentService.get_skills(
                db,
                profile.student_id,
            )
            skills_by_id = {
                item["skill_id"]: item
                for item in student_skills
            }

            for required_skill in drive.drive_skills:
                student_skill = skills_by_id.get(
                    required_skill.skill_id
                )

                skill_label = (
                    student_skill.get("skill_name")
                    if student_skill
                    else f"Required skill {required_skill.skill_id}"
                )

                if student_skill is None:
                    passed = False
                    message = (
                        f"{skill_label} is missing from your profile."
                    )
                elif required_skill.minimum_proficiency is None:
                    passed = True
                    message = (
                        f"{skill_label} is present in your profile."
                    )
                else:
                    required_level = (
                        required_skill.minimum_proficiency.strip().lower()
                    )
                    actual_level = (
                        student_skill["proficiency_level"] or ""
                    ).strip().lower()

                    required_rank = EligibilityService.PROFICIENCY_RANK.get(
                        required_level
                    )
                    actual_rank = EligibilityService.PROFICIENCY_RANK.get(
                        actual_level
                    )

                    passed = (
                        required_rank is not None
                        and actual_rank is not None
                        and actual_rank >= required_rank
                    )

                    if required_rank is None:
                        message = (
                            f"{skill_label} has an unsupported configured "
                            "proficiency requirement."
                        )
                    elif actual_rank is None:
                        message = (
                            f"{skill_label} proficiency is missing or "
                            "unrecognized in your profile."
                        )
                    elif passed:
                        message = (
                            f"{skill_label} meets the minimum proficiency "
                            f"of {required_skill.minimum_proficiency}."
                        )
                    else:
                        message = (
                            f"{skill_label} is below the minimum proficiency "
                            f"of {required_skill.minimum_proficiency}."
                        )

                EligibilityService._add_result(
                    results,
                    f"skill:{required_skill.skill_id}",
                    passed,
                    message,
                )



        if not results:
            EligibilityService._add_result(
                results,
                "configuration",
                False,
                "No eligibility criteria are configured. "
                "Eligibility cannot be determined.",
            )

        return EligibilityEvaluationResponse(
            drive_id=drive.drive_id,
            is_eligible=all(item.passed for item in results),
            results=results,
        )
