from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, model_validator

# -------------------------
# Student Profile
# -------------------------

class StudentProfileBase(BaseModel):
    branch_id: UUID
    enrollment_no: str
    semester: int | None = None
    cgpa: Decimal | None = None
    graduation_year: int | None = None
    active_backlogs: int | None = 0
    date_of_birth: date | None = None
    gender: str | None = None
    alternate_phone: str | None = None
    alternate_email: str | None = None
    father_name: str | None = None
    mother_name: str | None = None
    father_occupation: str | None = None
    abc_id: str | None = None
    college: str | None = None
    degree: str | None = None
    ssc_percentage: Decimal | None = None
    ssc_passing_year: int | None = None
    hsc_diploma_percentage: Decimal | None = None
    hsc_diploma_passing_year: int | None = None
    btech_aggregate: Decimal | None = None
    t_and_p_interest: str | None = None
    placement_interest: str | None = None
    career_area: str | None = None
    aptitude_prepared: bool | None = None
    aptitude_training_details: str | None = None
    languages_known: str | None = None
    english_rating: int | None = None
    ready_to_relocate: bool | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    bio: str | None = None


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileUpdate(BaseModel):
    branch_id: UUID | None = None
    semester: int | None = None
    cgpa: Decimal | None = None
    graduation_year: int | None = None
    active_backlogs: int | None = None
    date_of_birth: date | None = None
    gender: str | None = None
    alternate_phone: str | None = None
    alternate_email: str | None = None
    father_name: str | None = None
    mother_name: str | None = None
    father_occupation: str | None = None
    abc_id: str | None = None
    college: str | None = None
    degree: str | None = None
    ssc_percentage: Decimal | None = None
    ssc_passing_year: int | None = None
    hsc_diploma_percentage: Decimal | None = None
    hsc_diploma_passing_year: int | None = None
    btech_aggregate: Decimal | None = None
    t_and_p_interest: str | None = None
    placement_interest: str | None = None
    career_area: str | None = None
    aptitude_prepared: bool | None = None
    aptitude_training_details: str | None = None
    languages_known: str | None = None
    english_rating: int | None = None
    ready_to_relocate: bool | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    bio: str | None = None


class StudentProfileResponse(StudentProfileBase):
    model_config = ConfigDict(from_attributes=True)

    student_id: UUID
    user_id: UUID

    first_name: str
    last_name: str | None = None
    full_name: str
    email: str
    phone: str | None = None
    profile_photo: str | None = None

    resume_completion_percentage: int | None = None
    created_at: datetime
    updated_at: datetime

    @model_validator(mode="before")
    @classmethod
    def populate_user_fields(cls, data):
        if hasattr(data, "user"):
            user = data.user

            return {
                **{
                    column: getattr(data, column)
                    for column in cls.model_fields
                    if hasattr(data, column)
                },
                "first_name": user.first_name,
                "last_name": user.last_name,
                "full_name": (
                    f"{user.first_name} {user.last_name or ''}"
                ).strip(),
                "email": user.email,
                "phone": user.phone,
                "profile_photo": user.profile_photo,
            }

        return data


# -------------------------
# Student Skills
# -------------------------

class StudentSkillCreate(BaseModel):
    skill_id: UUID
    proficiency_level: str | None = None
    years_of_experience: Decimal | None = None


class StudentSkillResponse(StudentSkillCreate):
    model_config = ConfigDict(from_attributes=True)

    student_skill_id: UUID
    student_id: UUID
    created_at: datetime | None = None


# -------------------------
# Projects
# -------------------------

class ProjectCreate(BaseModel):
    title: str | None = None
    description: str | None = None
    github_url: str | None = None
    live_demo_url: str | None = None
    start_date: date | None = None
    end_date: date | None = None

class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    github_url: str | None = None
    live_demo_url: str | None = None
    start_date: date | None = None
    end_date: date | None = None

class ProjectResponse(ProjectCreate):
    model_config = ConfigDict(from_attributes=True)

    project_id: UUID
    student_id: UUID
    created_at: datetime | None = None


# -------------------------
# Project Skills
# -------------------------

class ProjectSkillCreate(BaseModel):
    skill_id: UUID


class ProjectSkillResponse(ProjectSkillCreate):
    model_config = ConfigDict(from_attributes=True)

    project_skill_id: UUID
    project_id: UUID
    created_at: datetime | None = None


# -------------------------
# Certifications
# -------------------------

class CertificationCreate(BaseModel):
    certificate_name: str | None = None
    issuing_organization: str | None = None
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_url: str | None = None

class CertificationUpdate(BaseModel):
    certificate_name: str | None = None
    issuing_organization: str | None = None
    issue_date: date | None = None
    expiry_date: date | None = None
    credential_url: str | None = None


class CertificationResponse(CertificationCreate):
    model_config = ConfigDict(from_attributes=True)

    certificate_id: UUID
    student_id: UUID
    created_at: datetime | None = None


# -------------------------
# Resumes
# -------------------------

class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    resume_id: UUID
    student_id: UUID
    resume_file_name: str
    resume_storage_path: str
    mime_type: str
    file_size_kb: int | None = None
    version: int
    is_default: bool | None = None
    uploaded_at: datetime

# -------------------------
# Student Internships
# -------------------------

class StudentInternshipCreate(BaseModel):
    company_name: str
    role_title: str | None = None
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    description: str | None = None
    certificate_url: str | None = None


class StudentInternshipUpdate(BaseModel):
    company_name: str | None = None
    role_title: str | None = None
    location: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    description: str | None = None
    certificate_url: str | None = None


class StudentInternshipResponse(StudentInternshipCreate):
    model_config = ConfigDict(from_attributes=True)

    internship_id: UUID
    student_id: UUID
    created_at: datetime | None = None

# -------------------------
# Student Achievements
# -------------------------

class StudentAchievementCreate(BaseModel):
    title: str
    description: str | None = None
    issuing_organization: str | None = None
    achievement_date: date | None = None
    credential_url: str | None = None


class StudentAchievementUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    issuing_organization: str | None = None
    achievement_date: date | None = None
    credential_url: str | None = None


class StudentAchievementResponse(StudentAchievementCreate):
    model_config = ConfigDict(from_attributes=True)

    achievement_id: UUID
    student_id: UUID
    created_at: datetime | None = None

# -------------------------
# Student Social Links
# -------------------------

class StudentSocialLinkCreate(BaseModel):
    platform: str
    profile_url: str


class StudentSocialLinkUpdate(BaseModel):
    platform: str | None = None
    profile_url: str | None = None

class StudentSocialLinkUpdate(BaseModel):
    platform: str | None = None
    profile_url: str | None = None


class StudentSocialLinkResponse(StudentSocialLinkCreate):
    model_config = ConfigDict(from_attributes=True)

    social_link_id: UUID
    student_id: UUID
    created_at: datetime | None = None