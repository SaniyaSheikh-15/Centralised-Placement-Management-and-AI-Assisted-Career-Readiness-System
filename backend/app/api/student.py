from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user
from backend.app.db.session import get_db
from backend.app.models.auth import User
from backend.app.schemas.student import (
    CertificationCreate,
    CertificationResponse,
    CertificationUpdate,
    ProjectCreate,
    ProjectResponse,
    ProjectSkillCreate,
    ProjectSkillResponse,
    ProjectUpdate,
    ResumeResponse,
    StudentAchievementCreate,
    StudentAchievementResponse,
    StudentAchievementUpdate,
    StudentInternshipCreate,
    StudentInternshipResponse,
    StudentInternshipUpdate,
    StudentProfileCreate,
    StudentProfileResponse,
    StudentProfileUpdate,
    StudentSkillCreate,
    StudentSkillResponse,
    StudentSocialLinkCreate,
    StudentSocialLinkResponse,
    StudentSocialLinkUpdate,
)
from backend.app.services.profile_photo_service import ProfilePhotoService
from backend.app.services.resume_service import ResumeService
from backend.app.services.student_service import StudentService


router = APIRouter(
    prefix="/students",
    tags=["Students"],
)


# ---------------------------------------------------------
# OWNERSHIP VERIFICATION
# ---------------------------------------------------------

def verify_student_ownership(
    db: Session,
    student_id: UUID,
    current_user: User,
):
    profile = StudentService.get_profile(
        db,
        student_id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    if profile.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not permitted to access this student profile",
        )

    return profile


# ---------------------------------------------------------
# CREATE STUDENT PROFILE
# ---------------------------------------------------------

@router.post(
    "/profile",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Student Profile",
)
def create_student_profile(
    request: StudentProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return StudentService.create_profile(
            db,
            current_user.user_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ---------------------------------------------------------
# GET STUDENT PROFILE
# ---------------------------------------------------------

@router.get(
    "/profile/{student_id}",
    response_model=StudentProfileResponse,
    summary="Get Student Profile",
)
def get_student_profile(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return verify_student_ownership(
        db,
        student_id,
        current_user,
    )


# ---------------------------------------------------------
# GET PROFILE BY USER ID
# ---------------------------------------------------------

@router.get(
    "/profile/user/{user_id}",
    response_model=StudentProfileResponse,
    summary="Get Student Profile by User ID",
)
def get_student_profile_by_user_id(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not permitted to access this student profile",
        )

    profile = StudentService.get_profile_by_user_id(
        db,
        user_id,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )

    return profile


# ---------------------------------------------------------
# UPDATE STUDENT PROFILE
# ---------------------------------------------------------

@router.put(
    "/profile/{student_id}",
    response_model=StudentProfileResponse,
    summary="Update Student Profile",
)
def update_student_profile(
    student_id: UUID,
    request: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_profile(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ---------------------------------------------------------
# STUDENT PROFILE PHOTO
# ---------------------------------------------------------

@router.post(
    "/profile/{student_id}/photo",
    summary="Upload Student Profile Photo",
)
async def upload_student_profile_photo(
    student_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        file_bytes = await file.read()

        ProfilePhotoService.validate_image(
            file.filename or "",
            file.content_type,
            len(file_bytes),
        )

        photo_path = ProfilePhotoService.save_file(
            file_bytes,
            str(student_id),
            file.content_type,
        )

        current_user.profile_photo = photo_path

        db.commit()
        db.refresh(current_user)

        return {
            "message": "Profile photo uploaded successfully",
            "profile_photo": current_user.profile_photo,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


# ---------------------------------------------------------
# DELETE STUDENT PROFILE
# ---------------------------------------------------------

@router.delete(
    "/profile/{student_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Profile",
)
def delete_student_profile(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_profile(
            db,
            student_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT SKILLS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/skills",
    response_model=StudentSkillResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Skill",
)
def create_student_skill(
    student_id: UUID,
    request: StudentSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_skill(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/skills",
    response_model=list[StudentSkillResponse],
    summary="Get Student Skills",
)
def get_student_skills(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_skills(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/skills/{student_skill_id}",
    response_model=StudentSkillResponse,
    summary="Update Student Skill",
)
def update_student_skill(
    student_id: UUID,
    student_skill_id: UUID,
    request: StudentSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_skill(
            db,
            student_id,
            student_skill_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/skills/{student_skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Skill",
)
def delete_student_skill(
    student_id: UUID,
    student_skill_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_skill(
            db,
            student_id,
            student_skill_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT PROJECTS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Project",
)
def create_student_project(
    student_id: UUID,
    request: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_project(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/projects",
    response_model=list[ProjectResponse],
    summary="Get Student Projects",
)
def get_student_projects(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_projects(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/projects/{project_id}",
    response_model=ProjectResponse,
    summary="Update Student Project",
)
def update_student_project(
    student_id: UUID,
    project_id: UUID,
    request: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_project(
            db,
            student_id,
            project_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Project",
)
def delete_student_project(
    student_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_project(
            db,
            student_id,
            project_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# PROJECT SKILLS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/projects/{project_id}/skills",
    response_model=ProjectSkillResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Skill to Student Project",
)
def create_project_skill(
    student_id: UUID,
    project_id: UUID,
    request: ProjectSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_project_skill(
            db,
            student_id,
            project_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/projects/{project_id}/skills",
    response_model=list[ProjectSkillResponse],
    summary="Get Project Skills",
)
def get_project_skills(
    student_id: UUID,
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.get_project_skills(
            db,
            student_id,
            project_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/projects/{project_id}/skills/{project_skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Project Skill",
)
def delete_project_skill(
    student_id: UUID,
    project_id: UUID,
    project_skill_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_project_skill(
            db,
            student_id,
            project_id,
            project_skill_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT INTERNSHIPS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/internships",
    response_model=StudentInternshipResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Internship",
)
def create_student_internship(
    student_id: UUID,
    request: StudentInternshipCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_internship(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/internships",
    response_model=list[StudentInternshipResponse],
    summary="Get Student Internships",
)
def get_student_internships(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_internships(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/internships/{internship_id}",
    response_model=StudentInternshipResponse,
    summary="Update Student Internship",
)
def update_student_internship(
    student_id: UUID,
    internship_id: UUID,
    request: StudentInternshipUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_internship(
            db,
            student_id,
            internship_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/internships/{internship_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Internship",
)
def delete_student_internship(
    student_id: UUID,
    internship_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_internship(
            db,
            student_id,
            internship_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT ACHIEVEMENTS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/achievements",
    response_model=StudentAchievementResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Achievement",
)
def create_student_achievement(
    student_id: UUID,
    request: StudentAchievementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_achievement(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/achievements",
    response_model=list[StudentAchievementResponse],
    summary="Get Student Achievements",
)
def get_student_achievements(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_achievements(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/achievements/{achievement_id}",
    response_model=StudentAchievementResponse,
    summary="Update Student Achievement",
)
def update_student_achievement(
    student_id: UUID,
    achievement_id: UUID,
    request: StudentAchievementUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_achievement(
            db,
            student_id,
            achievement_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/achievements/{achievement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Achievement",
)
def delete_student_achievement(
    student_id: UUID,
    achievement_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_achievement(
            db,
            student_id,
            achievement_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT SOCIAL LINKS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/social-links",
    response_model=StudentSocialLinkResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Social Link",
)
def create_student_social_link(
    student_id: UUID,
    request: StudentSocialLinkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_social_link(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/social-links",
    response_model=list[StudentSocialLinkResponse],
    summary="Get Student Social Links",
)
def get_student_social_links(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_social_links(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/social-links/{social_link_id}",
    response_model=StudentSocialLinkResponse,
    summary="Update Student Social Link",
)
def update_student_social_link(
    student_id: UUID,
    social_link_id: UUID,
    request: StudentSocialLinkUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_social_link(
            db,
            student_id,
            social_link_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/social-links/{social_link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Social Link",
)
def delete_student_social_link(
    student_id: UUID,
    social_link_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_social_link(
            db,
            student_id,
            social_link_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT CERTIFICATIONS
# ---------------------------------------------------------

@router.post(
    "/{student_id}/certifications",
    response_model=CertificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Student Certification",
)
def create_student_certification(
    student_id: UUID,
    request: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.create_certification(
            db,
            student_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/certifications",
    response_model=list[CertificationResponse],
    summary="Get Student Certifications",
)
def get_student_certifications(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_certifications(
        db,
        student_id,
    )


@router.put(
    "/{student_id}/certifications/{certificate_id}",
    response_model=CertificationResponse,
    summary="Update Student Certification",
)
def update_student_certification(
    student_id: UUID,
    certificate_id: UUID,
    request: CertificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        return StudentService.update_certification(
            db,
            student_id,
            certificate_id,
            request,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc


@router.delete(
    "/{student_id}/certifications/{certificate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Certification",
)
def delete_student_certification(
    student_id: UUID,
    certificate_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_certification(
            db,
            student_id,
            certificate_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


# ---------------------------------------------------------
# STUDENT RESUMES
# ---------------------------------------------------------

@router.post(
    "/{student_id}/resumes",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Student Resume",
)
async def upload_student_resume(
    student_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        file_bytes = await file.read()

        resume, _ = StudentService.create_resume(
            db,
            student_id,
            file.filename or "resume.pdf",
            file.content_type,
            file_bytes,
        )

        return resume

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{student_id}/resumes",
    response_model=list[ResumeResponse],
    summary="Get Student Resumes",
)
def get_student_resumes(
    student_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    return StudentService.get_resumes(
        db,
        student_id,
    )


@router.get(
    "/{student_id}/resumes/{resume_id}",
    response_model=ResumeResponse,
    summary="Get Student Resume",
)
def get_student_resume(
    student_id: UUID,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    resume = StudentService.get_resume(
        db,
        student_id,
        resume_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    return resume


@router.delete(
    "/{student_id}/resumes/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Student Resume",
)
def delete_student_resume(
    student_id: UUID,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    try:
        StudentService.delete_resume(
            db,
            student_id,
            resume_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return None


@router.get(
    "/{student_id}/resumes/{resume_id}/extract",
    summary="Extract Text From Student Resume",
)
def extract_student_resume(
    student_id: UUID,
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    verify_student_ownership(
        db,
        student_id,
        current_user,
    )

    resume = StudentService.get_resume(
        db,
        student_id,
        resume_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    try:
        extracted_text = ResumeService.extract_text(
            resume.resume_storage_path,
        )

        return {
            "resume_id": resume.resume_id,
            "resume_file_name": resume.resume_file_name,
            "extracted_text": extracted_text,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc