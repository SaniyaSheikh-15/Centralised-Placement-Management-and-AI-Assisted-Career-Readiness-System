"""SQLAlchemy ORM models.

The models are grouped by domain and mirror the frozen schema:

* :mod:`app.db.models.master`    - roles, branches, job_roles, skills
* :mod:`app.db.models.user`      - users, user_roles, refresh_tokens
* :mod:`app.db.models.student`   - profiles, skills, projects, resumes ...
* :mod:`app.db.models.placement` - companies, drives, eligibility, applications
* :mod:`app.db.models.ai`        - AI tables + backend-owned interview tables

Importing this package re-exports every model so ``Base.metadata`` is fully
populated before ``create_all`` runs.
"""

from app.db.models.ai import (
    CareerChat,
    InterviewQuestion,
    InterviewSession,
    MockInterview,
    Notification,
    ResumeAnalysis,
    SkillGapReport,
)
from app.db.models.master import Branch, JobRole, Role, Skill
from app.db.models.placement import (
    Application,
    Company,
    DriveBranch,
    DriveDocument,
    DriveSkill,
    EligibilityRule,
    PlacementDrive,
    Recruiter,
)
from app.db.models.student import (
    Certification,
    Project,
    ProjectSkill,
    Resume,
    StudentProfile,
    StudentSkill,
)
from app.db.models.user import RefreshToken, User, UserRole

__all__ = [
    # master
    "Role",
    "Branch",
    "JobRole",
    "Skill",
    # user
    "User",
    "UserRole",
    "RefreshToken",
    # student
    "StudentProfile",
    "StudentSkill",
    "Project",
    "ProjectSkill",
    "Certification",
    "Resume",
    # placement
    "Company",
    "Recruiter",
    "PlacementDrive",
    "EligibilityRule",
    "DriveBranch",
    "DriveSkill",
    "Application",
    "DriveDocument",
    # ai
    "ResumeAnalysis",
    "SkillGapReport",
    "MockInterview",
    "CareerChat",
    "Notification",
    "InterviewSession",
    "InterviewQuestion",
]
