from backend.app.models.auth import (
    Company,
    OTPCode,
    Recruiter,
    Role,
    TPAccessRequest,
    User,
    UserRole,
)

from backend.app.models.student import (
    Branch,
    Certification,
    Project,
    ProjectSkill,
    Resume,
    Skill,
    StudentProfile,
    StudentSkill,
    StudentInternship,
    StudentAchievement,
    StudentSocialLink,
)

from backend.app.models.placement_drive import (
    PlacementDrive,
    EligibilityRule,
    DriveBranch,
    DriveSkill,
    DriveDocument,
)


__all__ = [
    # Auth
    "Role",
    "User",
    "UserRole",
    "Company",
    "Recruiter",
    "TPAccessRequest",
    "OTPCode",

    # Student
    "Branch",
    "Skill",
    "StudentProfile",
    "StudentSkill",
    "Project",
    "ProjectSkill",
    "Certification",
    "Resume",
    "StudentInternship",
    "StudentAchievement",
    "StudentSocialLink",

    # Placement Drives
    "PlacementDrive",
    "EligibilityRule",
    "DriveBranch",
    "DriveSkill",
    "DriveDocument",
]