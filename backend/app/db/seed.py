"""Demo/seed data.

``SEED_DEMO_DATA=true`` populates the master tables plus one fully-formed demo
student (profile, skills, projects, resume analysis) and a handful of open
placement drives. This makes every AI endpoint immediately exercisable via
Swagger - and satisfies the foreign keys on the frozen schema - without the full
production seed.

The routine is idempotent: it does nothing if the ``roles`` table is populated.
"""

from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging_config import get_logger
from app.core.security import hash_password
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
    Recruiter,
    Resume,
    ResumeAnalysis,
    Role,
    Skill,
    StudentProfile,
    StudentSkill,
    User,
    UserRole,
)

logger = get_logger(__name__)

# Fixed credentials for the demo accounts (documented in the backend README).
DEMO_STUDENT_EMAIL = "student@campusconnect.dev"
DEMO_STUDENT_PASSWORD = "Password123"
DEMO_OFFICER_EMAIL = "officer@campusconnect.dev"
DEMO_OFFICER_PASSWORD = "Password123"

# Skills the demo student owns (name, category, proficiency, years).
_STUDENT_SKILLS = [
    ("Python", "Programming Languages", "Advanced", 3.0),
    ("JavaScript", "Programming Languages", "Intermediate", 2.0),
    ("SQL", "Programming Languages", "Intermediate", 2.0),
    ("React", "Frontend Development", "Intermediate", 2.0),
    ("FastAPI", "Backend Development", "Intermediate", 1.5),
    ("PostgreSQL", "Databases", "Intermediate", 2.0),
    ("Docker", "DevOps", "Beginner", 1.0),
    ("Machine Learning", "Machine Learning", "Beginner", 1.0),
    ("Communication", "Soft Skills", "Advanced", 4.0),
]

# Skills required across the demo drives.
_DRIVE_SKILLS = [
    ("Python", "Programming Languages"),
    ("FastAPI", "Backend Development"),
    ("PostgreSQL", "Databases"),
    ("Docker", "DevOps"),
    ("React", "Frontend Development"),
    ("Machine Learning", "Machine Learning"),
    ("REST API", "Backend Development"),
    ("System Design", "System Design"),
    ("Data Structures", "Programming Languages"),
]


async def is_seeded(db: AsyncSession) -> bool:
    """Return True when the master ``roles`` table already has rows."""
    count = (await db.execute(select(func.count()).select_from(Role))).scalar_one()
    return count > 0
async def _get_or_create_skills(db: AsyncSession, names: dict[str, str]) -> dict[str, Skill]:
    """Ensure every skill in ``names`` exists; return a name -> Skill map."""
    existing = {
        s.skill_name: s
        for s in (await db.execute(select(Skill).where(Skill.skill_name.in_(list(names))))).scalars()
    }
    for name, category in names.items():
        if name not in existing:
            skill = Skill(skill_name=name, category=category)
            db.add(skill)
            existing[name] = skill
    await db.flush()
    return existing


async def seed_demo_data(db: AsyncSession) -> None:
    """Populate the demo dataset (idempotent).

    Caller is responsible for committing the session.
    """
    if await is_seeded(db):
        logger.info("Seed skipped: database already contains master data.")
        return

    now = datetime.now(timezone.utc)

    # --- Roles ------------------------------------------------------
    role_names = ["Student", "Recruiter", "Placement Officer", "System Administrator"]
    roles = {name: Role(role_name=name, description=f"{name} role") for name in role_names}
    db.add_all(roles.values())
    await db.flush()

    # --- Branch -----------------------------------------------------
    branch = Branch(branch_code="CSE", branch_name="Computer Science and Engineering", department="Engineering")
    db.add(branch)
    await db.flush()

    # --- Job roles --------------------------------------------------
    job_role_specs = [
        ("Software Engineer", "Software Development"),
        ("Backend Developer", "Software Development"),
        ("Full Stack Developer", "Software Development"),
        ("Data Scientist", "Data Science"),
        ("AI Engineer", "Artificial Intelligence"),
    ]
    job_roles = {t: JobRole(role_title=t, category=c, description=f"{t} role") for t, c in job_role_specs}
    db.add_all(job_roles.values())
    await db.flush()

    # --- Skills -----------------------------------------------------
    skill_names: dict[str, str] = {name: cat for name, cat, _, _ in _STUDENT_SKILLS}
    skill_names.update({name: (cat or "General") for name, cat in _DRIVE_SKILLS})
    skills = await _get_or_create_skills(db, skill_names)

    # --- Companies --------------------------------------------------
    companies = {
        "Google": Company(company_name="Google", industry="Information Technology", headquarters="Mountain View, USA"),
        "Microsoft": Company(company_name="Microsoft", industry="Information Technology", headquarters="Redmond, USA"),
        "TCS": Company(company_name="TCS", industry="Information Technology", headquarters="Mumbai, India"),
    }
    db.add_all(companies.values())
    await db.flush()

    # --- Recruiter user + recruiter ---------------------------------
    recruiter_user = User(
        first_name="Riya", last_name="Recruiter",
        email="recruiter@campusconnect.dev",
        password_hash=hash_password("Password123"),
        is_verified=True, is_active=True,
    )
    db.add(recruiter_user)
    await db.flush()
    db.add(UserRole(user_id=recruiter_user.user_id, role_id=roles["Recruiter"].role_id))

    recruiter = Recruiter(
        user_id=recruiter_user.user_id, company_id=companies["Google"].company_id,
        designation="University Relations", official_email="recruiter@campusconnect.dev",
    )
    db.add(recruiter)
    await db.flush()

    # --- Demo student user + profile --------------------------------
    student_user = User(
        first_name="Aarav", last_name="Sharma",
        email=DEMO_STUDENT_EMAIL,
        password_hash=hash_password(DEMO_STUDENT_PASSWORD),
        is_verified=True, is_active=True, phone="+91-9000000000",
    )
    db.add(student_user)
    await db.flush()
    db.add(UserRole(user_id=student_user.user_id, role_id=roles["Student"].role_id))

    profile = StudentProfile(
        user_id=student_user.user_id, branch_id=branch.branch_id,
        enrollment_no="CSE2026001", semester=7, cgpa=8.40, graduation_year=2026,
        active_backlogs=0, gender="Male",
        github_url="https://github.com/aarav", linkedin_url="https://linkedin.com/in/aarav",
        bio="Final-year CSE student passionate about backend engineering and applied AI.",
        resume_completion_percentage=85,
    )
    db.add(profile)
    await db.flush()
    student_id = profile.student_id

    # --- Student skills ---------------------------------------------
    for name, _cat, proficiency, years in _STUDENT_SKILLS:
        db.add(StudentSkill(
            student_id=student_id, skill_id=skills[name].skill_id,
            proficiency_level=proficiency, years_of_experience=years,
        ))

    # --- Projects ---------------------------------------------------
    project = Project(
        student_id=student_id, title="Campus Placement Portal",
        description="A FastAPI + React portal for managing campus placement drives.",
        github_url="https://github.com/aarav/placement-portal",
    )
    db.add(project)
    await db.flush()
    for skill_name in ("Python", "FastAPI", "React", "PostgreSQL"):
        db.add(ProjectSkill(project_id=project.project_id, skill_id=skills[skill_name].skill_id))

    # --- Resume + analysis ------------------------------------------
    resume = Resume(
        student_id=student_id, resume_file_name="aarav_sharma_resume.pdf",
        resume_storage_path="uploads/aarav_sharma_resume.pdf", mime_type="application/pdf",
        file_size_kb=220, version=1, is_default=True,
    )
    db.add(resume)
    await db.flush()
    db.add(ResumeAnalysis(
        resume_id=resume.resume_id, job_role_id=job_roles["Backend Developer"].job_role_id,
        ats_score=78.0, job_match_percentage=72.0,
        missing_keywords="Docker, Kubernetes, System Design",
        strengths="Strong project experience; clear structure.",
        weaknesses="Lacks quantified impact; missing container/cloud keywords.",
        recommendations="Add metrics to project bullets and include Docker/System Design keywords.",
    ))

    # --- Placement drives -------------------------------------------
    drive_specs = [
        {
            "company": "Google", "role": "Software Engineer", "recruiter": recruiter,
            "title": "Google SDE - 2026 Grad",
            "min_cgpa": 8.0, "max_backlogs": 0, "grad_year": 2026,
            "min_pkg": 25.0, "max_pkg": 45.0, "location": "Bengaluru",
            "skills": ["Python", "REST API", "System Design", "Data Structures"],
            "deadline_days": 14,
        },
        {
            "company": "Microsoft", "role": "Data Scientist", "recruiter": recruiter,
            "title": "Microsoft Data Scientist - New Grad",
            "min_cgpa": 8.5, "max_backlogs": 0, "grad_year": 2026,
            "min_pkg": 22.0, "max_pkg": 40.0, "location": "Hyderabad",
            "skills": ["Python", "Machine Learning", "PostgreSQL"],
            "deadline_days": 10,
        },
        {
            "company": "TCS", "role": "Full Stack Developer", "recruiter": recruiter,
            "title": "TCS Digital Full Stack Hiring",
            "min_cgpa": 6.0, "max_backlogs": 1, "grad_year": 2026,
            "min_pkg": 7.0, "max_pkg": 11.5, "location": "Pune",
            "skills": ["React", "FastAPI", "PostgreSQL", "Docker"],
            "deadline_days": 21,
        },
    ]
    for spec in drive_specs:
        drive = PlacementDrive(
            company_id=companies[spec["company"]].company_id,
            recruiter_id=recruiter.recruiter_id,
            job_role_id=job_roles[spec["role"]].job_role_id,
            drive_title=spec["title"],
            job_description=f"{spec['title']} - open to eligible final-year students.",
            employment_type="FULL_TIME", work_mode="ON_SITE", location=spec["location"],
            minimum_package_lpa=spec["min_pkg"], maximum_package_lpa=spec["max_pkg"],
            vacancies=5, registration_deadline=now + timedelta(days=spec["deadline_days"]),
            drive_date=now + timedelta(days=spec["deadline_days"] + 7), status="PUBLISHED",
        )
        db.add(drive)
        await db.flush()
        db.add(EligibilityRule(
            drive_id=drive.drive_id, minimum_cgpa=spec["min_cgpa"],
            maximum_backlogs=spec["max_backlogs"], graduation_year=spec["grad_year"],
        ))
        db.add(DriveBranch(drive_id=drive.drive_id, branch_id=branch.branch_id))
        for skill_name in spec["skills"]:
            db.add(DriveSkill(drive_id=drive.drive_id, skill_id=skills[skill_name].skill_id))

    # --- Placement officer user -------------------------------------
    officer_user = User(
        first_name="Priya", last_name="Officer", email=DEMO_OFFICER_EMAIL,
        password_hash=hash_password(DEMO_OFFICER_PASSWORD), is_verified=True, is_active=True,
    )
    db.add(officer_user)
    await db.flush()
    db.add(UserRole(user_id=officer_user.user_id, role_id=roles["Placement Officer"].role_id))

    await db.flush()
    logger.info(
        "Demo data seeded. Student login: %s / %s", DEMO_STUDENT_EMAIL, DEMO_STUDENT_PASSWORD
    )
