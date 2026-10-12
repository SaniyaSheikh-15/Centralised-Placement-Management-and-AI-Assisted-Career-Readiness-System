"""RAG retrieval for the Career Assistant.

Implements the PRD §3.2 "Context Retrieval" step: it assembles a *structured*
snapshot of a student's situation from the database so the LLM can be strictly
grounded in real records:

* student profile + branch (``student_profiles``, ``branches``)
* skills held (``student_skills`` + ``skills``)
* projects evidence (``projects`` + ``project_skills``)
* currently open placement drives, with eligibility and required skills
  (``placement_drives``, ``companies``, ``job_roles``, ``eligibility_rules``,
  ``drive_skills``, ``drive_branches``)
* latest parsed-resume analysis (``resumes`` + ``resume_analysis``)
* stored skill-gap report, if any (``skill_gap_reports``)

The returned context is plain JSON-serialisable data; a parallel list of
``sources`` records *what* was retrieved for RAG transparency in responses.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging_config import get_logger
from app.db.models import (
    Branch,
    Company,
    DriveBranch,
    DriveSkill,
    EligibilityRule,
    JobRole,
    PlacementDrive,
    Project,
    ProjectSkill,
    Resume,
    ResumeAnalysis,
    Skill,
    SkillGapReport,
    StudentProfile,
    StudentSkill,
    User,
)

logger = get_logger(__name__)

# Drives with these statuses are considered "upcoming/open" for guidance.
OPEN_DRIVE_STATUSES = ("PUBLISHED", "ONGOING", "REGISTRATION_CLOSED")
MAX_DRIVES_IN_CONTEXT = 15


def _iso(value: datetime | None) -> str | None:
    """Serialise a datetime to ISO-8601 (UTC) or ``None``."""
    return value.isoformat() if value else None


# ----------------------------------------------------------------------
# Individual retrievers
# ----------------------------------------------------------------------
async def fetch_student_profile(
    db: AsyncSession, student_id: uuid.UUID
) -> dict[str, Any] | None:
    """Return the student's academic profile enriched with branch/user names."""
    profile = await db.get(StudentProfile, student_id)
    if profile is None:
        return None

    branch = await db.get(Branch, profile.branch_id)
    user = await db.get(User, profile.user_id)

    return {
        "student_id": str(profile.student_id),
        "name": user.full_name if user else None,
        "enrollment_no": profile.enrollment_no,
        "branch": branch.branch_name if branch else None,
        "branch_code": branch.branch_code if branch else None,
        "semester": profile.semester,
        "cgpa": float(profile.cgpa) if profile.cgpa is not None else None,
        "graduation_year": profile.graduation_year,
        "active_backlogs": profile.active_backlogs,
        "bio": profile.bio,
        "resume_completion_percentage": profile.resume_completion_percentage,
    }


async def fetch_student_skills(
    db: AsyncSession, student_id: uuid.UUID
) -> list[dict[str, Any]]:
    """Return the student's skills with proficiency levels."""
    stmt = (
        select(Skill.skill_name, Skill.category, StudentSkill.proficiency_level)
        .join(StudentSkill, StudentSkill.skill_id == Skill.skill_id)
        .where(StudentSkill.student_id == student_id)
        .order_by(Skill.skill_name)
    )
    rows = (await db.execute(stmt)).all()
    return [
        {"skill": name, "category": category, "proficiency": proficiency}
        for name, category, proficiency in rows
    ]


async def fetch_student_projects(
    db: AsyncSession, student_id: uuid.UUID
) -> list[dict[str, Any]]:
    """Return the student's projects, each with the skills it demonstrates."""
    projects = (
        await db.execute(select(Project).where(Project.student_id == student_id))
    ).scalars().all()
    if not projects:
        return []

    project_ids = [p.project_id for p in projects]
    skill_rows = (
        await db.execute(
            select(ProjectSkill.project_id, Skill.skill_name)
            .join(Skill, Skill.skill_id == ProjectSkill.skill_id)
            .where(ProjectSkill.project_id.in_(project_ids))
        )
    ).all()
    skills_by_project: dict[uuid.UUID, list[str]] = {}
    for project_id, skill_name in skill_rows:
        skills_by_project.setdefault(project_id, []).append(skill_name)

    return [
        {
            "title": p.title,
            "description": p.description,
            "skills_used": skills_by_project.get(p.project_id, []),
        }
        for p in projects
    ]


async def _fetch_drive_children(
    db: AsyncSession, drive_ids: list[uuid.UUID]
) -> tuple[dict, dict, dict]:
    """Bulk-load eligibility, required skills and eligible branches for drives."""
    if not drive_ids:
        return {}, {}, {}

    eligibility_rows = (
        await db.execute(
            select(EligibilityRule).where(EligibilityRule.drive_id.in_(drive_ids))
        )
    ).scalars().all()
    eligibility = {e.drive_id: e for e in eligibility_rows}

    skill_rows = (
        await db.execute(
            select(DriveSkill.drive_id, Skill.skill_name, DriveSkill.minimum_proficiency)
            .join(Skill, Skill.skill_id == DriveSkill.skill_id)
            .where(DriveSkill.drive_id.in_(drive_ids))
        )
    ).all()
    skills: dict[uuid.UUID, list[dict[str, str]]] = {}
    for drive_id, skill_name, min_prof in skill_rows:
        skills.setdefault(drive_id, []).append(
            {"skill": skill_name, "minimum_proficiency": min_prof}
        )

    branch_rows = (
        await db.execute(
            select(DriveBranch.drive_id, Branch.branch_code)
            .join(Branch, Branch.branch_id == DriveBranch.branch_id)
            .where(DriveBranch.drive_id.in_(drive_ids))
        )
    ).all()
    branches: dict[uuid.UUID, list[str]] = {}
    for drive_id, branch_code in branch_rows:
        branches.setdefault(drive_id, []).append(branch_code)

    return eligibility, skills, branches


def _evaluate_eligibility(
    profile: dict[str, Any] | None,
    rule: EligibilityRule | None,
    eligible_branch_codes: list[str],
) -> tuple[bool, list[str]]:
    """Return ``(is_eligible, reasons)`` for a drive given the student profile.

    Only checks the criteria present in the DB; unknown criteria are skipped.
    ``reasons`` lists every failed condition so the assistant can explain *why*
    a student is not eligible.
    """
    if profile is None:
        return False, ["Student profile is not available."]
    if rule is None:
        return True, []

    reasons: list[str] = []
    cgpa = profile.get("cgpa")
    if rule.minimum_cgpa is not None and cgpa is not None and cgpa < float(rule.minimum_cgpa):
        reasons.append(f"CGPA {cgpa} is below the minimum {float(rule.minimum_cgpa)}")
    if (
        rule.maximum_backlogs is not None
        and profile.get("active_backlogs") is not None
        and profile["active_backlogs"] > rule.maximum_backlogs
    ):
        reasons.append(
            f"Active backlogs {profile['active_backlogs']} exceed the maximum {rule.maximum_backlogs}"
        )
    if (
        rule.graduation_year is not None
        and profile.get("graduation_year") is not None
        and profile["graduation_year"] != rule.graduation_year
    ):
        reasons.append(
            f"Graduation year {profile['graduation_year']} does not match required {rule.graduation_year}"
        )
    branch_code = profile.get("branch_code")
    if eligible_branch_codes and branch_code and branch_code not in eligible_branch_codes:
        reasons.append(f"Branch {branch_code} is not in the eligible branches")

    return (len(reasons) == 0), reasons


async def fetch_open_drives(
    db: AsyncSession, profile: dict[str, Any] | None
) -> list[dict[str, Any]]:
    """Return currently open drives with eligibility + required skills."""
    stmt = (
        select(PlacementDrive, Company, JobRole)
        .join(Company, Company.company_id == PlacementDrive.company_id)
        .join(JobRole, JobRole.job_role_id == PlacementDrive.job_role_id)
        .where(PlacementDrive.status.in_(OPEN_DRIVE_STATUSES))
        .order_by(PlacementDrive.registration_deadline.is_(None), PlacementDrive.registration_deadline)
        .limit(MAX_DRIVES_IN_CONTEXT)
    )
    rows = (await db.execute(stmt)).all()
    if not rows:
        return []

    drive_ids = [d.drive_id for d, _, _ in rows]
    eligibility, skills, branches = await _fetch_drive_children(db, drive_ids)

    drives: list[dict[str, Any]] = []
    for drive, company, job_role in rows:
        rule = eligibility.get(drive.drive_id)
        eligible_branch_codes = branches.get(drive.drive_id, [])
        is_eligible, reasons = _evaluate_eligibility(profile, rule, eligible_branch_codes)
        drives.append(
            {
                "drive_id": str(drive.drive_id),
                "drive_title": drive.drive_title,
                "company": company.company_name,
                "job_role": job_role.role_title,
                "location": drive.location,
                "work_mode": drive.work_mode,
                "employment_type": drive.employment_type,
                "package_lpa": {
                    "min": float(drive.minimum_package_lpa) if drive.minimum_package_lpa else None,
                    "max": float(drive.maximum_package_lpa) if drive.maximum_package_lpa else None,
                },
                "vacancies": drive.vacancies,
                "registration_deadline": _iso(drive.registration_deadline),
                "status": drive.status,
                "required_skills": skills.get(drive.drive_id, []),
                "eligible_branches": eligible_branch_codes,
                "eligibility": {
                    "minimum_cgpa": float(rule.minimum_cgpa) if rule and rule.minimum_cgpa else None,
                    "maximum_backlogs": rule.maximum_backlogs if rule else None,
                    "graduation_year": rule.graduation_year if rule else None,
                },
                "student_is_eligible": is_eligible,
                "eligibility_gaps": reasons,
            }
        )
    return drives


async def fetch_resume_analysis(
    db: AsyncSession, student_id: uuid.UUID
) -> dict[str, Any] | None:
    """Return the latest resume + its AI analysis, if present."""
    resume = (
        await db.execute(
            select(Resume)
            .where(Resume.student_id == student_id)
            .order_by(Resume.is_default.desc(), Resume.version.desc())
            .limit(1)
        )
    ).scalars().first()
    if resume is None:
        return None

    analysis = (
        await db.execute(
            select(ResumeAnalysis)
            .where(ResumeAnalysis.resume_id == resume.resume_id)
            .order_by(ResumeAnalysis.analyzed_at.desc())
            .limit(1)
        )
    ).scalars().first()

    return {
        "file_name": resume.resume_file_name,
        "version": resume.version,
        "is_default": resume.is_default,
        "uploaded_at": _iso(resume.uploaded_at),
        "ats_score": float(analysis.ats_score) if analysis and analysis.ats_score else None,
        "job_match_percentage": (
            float(analysis.job_match_percentage) if analysis and analysis.job_match_percentage else None
        ),
        "missing_keywords": analysis.missing_keywords if analysis else None,
        "strengths": analysis.strengths if analysis else None,
        "weaknesses": analysis.weaknesses if analysis else None,
        "recommendations": analysis.recommendations if analysis else None,
    }


async def fetch_skill_gap_report(
    db: AsyncSession, student_id: uuid.UUID
) -> dict[str, Any] | None:
    """Return the most recent stored skill-gap report, if any."""
    report = (
        await db.execute(
            select(SkillGapReport)
            .where(SkillGapReport.student_id == student_id)
            .order_by(SkillGapReport.generated_at.desc())
            .limit(1)
        )
    ).scalars().first()
    if report is None:
        return None

    job_role = (
        await db.get(JobRole, report.target_job_role_id) if report.target_job_role_id else None
    )
    return {
        "target_role": job_role.role_title if job_role else None,
        "missing_skills": report.missing_skills,
        "recommended_courses": report.recommended_courses,
        "generated_at": _iso(report.generated_at),
    }


async def resolve_target_role(db: AsyncSession, student_id: uuid.UUID) -> tuple[uuid.UUID | None, str]:
    """Resolve the student's target job role.

    Priority: latest skill-gap report → role of a drive the student applied to →
    a sensible default. Returns ``(job_role_id_or_None, role_title)``.
    """
    report = (
        await db.execute(
            select(SkillGapReport)
            .where(
                SkillGapReport.student_id == student_id,
                SkillGapReport.target_job_role_id.is_not(None),
            )
            .order_by(SkillGapReport.generated_at.desc())
            .limit(1)
        )
    ).scalars().first()
    if report and report.target_job_role_id:
        job_role = await db.get(JobRole, report.target_job_role_id)
        if job_role:
            return job_role.job_role_id, job_role.role_title

    return None, "Software Engineer"


# ----------------------------------------------------------------------
# Aggregation
# ----------------------------------------------------------------------
async def build_rag_context(
    db: AsyncSession, student_id: uuid.UUID
) -> tuple[dict[str, Any], list[dict[str, str]]]:
    """Assemble the full structured context and its provenance list.

    Returns
    -------
    (context, sources)
        ``context`` is the JSON injected into the prompt; ``sources`` describes
        which records grounded the answer.
    """
    profile = await fetch_student_profile(db, student_id)
    skills = await fetch_student_skills(db, student_id)
    projects = await fetch_student_projects(db, student_id)
    drives = await fetch_open_drives(db, profile)
    resume = await fetch_resume_analysis(db, student_id)
    gap = await fetch_skill_gap_report(db, student_id)

    context: dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "student_profile": profile,
        "skills": skills,
        "projects": projects,
        "open_placement_drives": drives,
        "resume_analysis": resume,
        "skill_gap_report": gap,
    }

    # Provenance for RAG transparency.
    sources: list[dict[str, str]] = []
    if profile:
        sources.append({"source": "student_profiles", "detail": f"Profile for {profile.get('name') or profile['student_id']}"})
    if skills:
        sources.append({"source": "student_skills", "detail": f"{len(skills)} skills on record"})
    if projects:
        sources.append({"source": "projects", "detail": f"{len(projects)} projects"})
    if drives:
        eligible = sum(1 for d in drives if d["student_is_eligible"])
        sources.append(
            {"source": "placement_drives", "detail": f"{len(drives)} open drives ({eligible} eligible)"}
        )
    if resume:
        sources.append({"source": "resume_analysis", "detail": f"Resume v{resume['version']} analysed"})
    if gap:
        sources.append({"source": "skill_gap_reports", "detail": "Stored skill-gap report"})

    return context, sources


async def build_resume_summary(
    db: AsyncSession, student_id: uuid.UUID
) -> tuple[str, bool]:
    """Build a compact textual resume digest for resume-Q&A.

    Returns ``(summary_text, has_resume)``.
    """
    profile = await fetch_student_profile(db, student_id)
    skills = await fetch_student_skills(db, student_id)
    projects = await fetch_student_projects(db, student_id)
    resume = await fetch_resume_analysis(db, student_id)

    if not any([profile, skills, projects, resume]):
        return "", False

    lines: list[str] = []
    if profile:
        lines.append(
            f"Student: {profile.get('name')}, branch {profile.get('branch')}, "
            f"CGPA {profile.get('cgpa')}, graduating {profile.get('graduation_year')}."
        )
    if skills:
        lines.append("Skills: " + ", ".join(s["skill"] for s in skills) + ".")
    if projects:
        lines.append(
            "Projects: " + "; ".join((p.get("title") or "Untitled") for p in projects) + "."
        )
    if resume:
        lines.append(
            f"Resume: {resume['file_name']} (v{resume['version']}), ATS {resume['ats_score']}, "
            f"match {resume['job_match_percentage']}%."
        )
        if resume.get("missing_keywords"):
            lines.append(f"Missing keywords: {resume['missing_keywords']}.")

    has_resume = resume is not None or bool(projects) or bool(skills)
    return "\n".join(lines), has_resume
