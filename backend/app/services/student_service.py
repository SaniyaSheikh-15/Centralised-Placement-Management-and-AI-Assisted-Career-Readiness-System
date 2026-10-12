from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Session

from backend.app.models.student import (
    StudentProfile,
    StudentSkill,
    Skill,
    Project,
    ProjectSkill,
    Certification,
    Resume,
    StudentInternship,
    StudentAchievement,
    StudentSocialLink,
)

from backend.app.schemas.student import (
    StudentProfileCreate,
    StudentProfileUpdate,
    StudentSkillCreate,
    StudentSkillResponse,
    ProjectCreate,
    ProjectUpdate,
    ProjectSkillCreate,
    CertificationCreate,
    CertificationUpdate,
    StudentInternshipCreate,
    StudentInternshipUpdate,
    StudentAchievementCreate,
    StudentAchievementUpdate,
    StudentSocialLinkCreate,
    StudentSocialLinkUpdate,
)

from backend.app.repositories.student_skill_repository import (
    StudentSkillRepository,
)
from backend.app.repositories.project_repository import (
    ProjectRepository,
)
from backend.app.repositories.project_skill_repository import (
    ProjectSkillRepository,
)
from backend.app.repositories.certification_repository import (
    CertificationRepository,
)
from backend.app.repositories.resume_repository import (
    ResumeRepository,
)

from backend.app.services.resume_service import ResumeService


class StudentService:

    # ---------------------------------------------------------
    # STUDENT PROFILE
    # ---------------------------------------------------------

    @staticmethod
    def get_profile(
        db: Session,
        student_id: UUID,
    ) -> StudentProfile | None:
        return (
            db.query(StudentProfile)
            .filter(StudentProfile.student_id == student_id)
            .first()
        )

    @staticmethod
    def get_profile_by_user_id(
        db: Session,
        user_id: UUID,
    ) -> StudentProfile | None:
        return (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == user_id)
            .first()
        )

    @staticmethod
    def create_profile(
        db: Session,
        user_id: UUID,
        request: StudentProfileCreate,
    ) -> StudentProfile:

        existing_profile = (
            db.query(StudentProfile)
            .filter(StudentProfile.user_id == user_id)
            .first()
        )

        if existing_profile:
            raise ValueError(
                "Student profile already exists for this user"
            )

        existing_enrollment = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.enrollment_no
                == request.enrollment_no
            )
            .first()
        )

        if existing_enrollment:
            raise ValueError(
                "Enrollment number already exists"
            )

        now = datetime.utcnow()

        profile = StudentProfile(
            user_id=user_id,
            branch_id=request.branch_id,
            enrollment_no=request.enrollment_no,
            semester=request.semester,
            cgpa=request.cgpa,
            graduation_year=request.graduation_year,
            active_backlogs=request.active_backlogs,
            date_of_birth=request.date_of_birth,
            gender=request.gender,
            alternate_phone=request.alternate_phone,
            alternate_email=request.alternate_email,
            father_name=request.father_name,
            mother_name=request.mother_name,
            father_occupation=request.father_occupation,
            abc_id=request.abc_id,
            college=request.college,
            degree=request.degree,
            ssc_percentage=request.ssc_percentage,
            ssc_passing_year=request.ssc_passing_year,
            hsc_diploma_percentage=request.hsc_diploma_percentage,
            hsc_diploma_passing_year=request.hsc_diploma_passing_year,
            btech_aggregate=request.btech_aggregate,
            t_and_p_interest=request.t_and_p_interest,
            placement_interest=request.placement_interest,
            career_area=request.career_area,
            aptitude_prepared=request.aptitude_prepared,
            aptitude_training_details=request.aptitude_training_details,
            languages_known=request.languages_known,
            english_rating=request.english_rating,
            ready_to_relocate=request.ready_to_relocate,
            linkedin_url=request.linkedin_url,
            github_url=request.github_url,
            portfolio_url=request.portfolio_url,
            bio=request.bio,
            created_at=now,
            updated_at=now,
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def update_profile(
        db: Session,
        student_id: UUID,
        request: StudentProfileUpdate,
    ) -> StudentProfile:

        profile = (
            db.query(StudentProfile)
            .filter(StudentProfile.student_id == student_id)
            .first()
        )

        if not profile:
            raise ValueError("Student profile not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        if "enrollment_no" in update_data:
            existing = (
                db.query(StudentProfile)
                .filter(
                    StudentProfile.enrollment_no
                    == update_data["enrollment_no"],
                    StudentProfile.student_id != student_id,
                )
                .first()
            )

            if existing:
                raise ValueError(
                    "Enrollment number already exists"
                )

        for field, value in update_data.items():
            setattr(profile, field, value)

        profile.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def delete_profile(
        db: Session,
        student_id: UUID,
    ) -> None:

        profile = (
            db.query(StudentProfile)
            .filter(StudentProfile.student_id == student_id)
            .first()
        )

        if not profile:
            raise ValueError("Student profile not found")

        db.delete(profile)
        db.commit()

    # ---------------------------------------------------------
    # STUDENT SKILLS
    # ---------------------------------------------------------

    @staticmethod
    def get_skills(db: Session, student_id: UUID):
        rows = (
            db.query(StudentSkill, Skill)
            .join(Skill, StudentSkill.skill_id == Skill.skill_id)
            .filter(StudentSkill.student_id == student_id)
            .order_by(StudentSkill.created_at.desc())
            .all()
        )

        return [
            {
                "student_skill_id": student_skill.student_skill_id,
                "student_id": student_skill.student_id,
                "skill_id": student_skill.skill_id,
                "skill_name": skill.skill_name,
                "proficiency_level": student_skill.proficiency_level,
                "years_of_experience": student_skill.years_of_experience,
                "created_at": student_skill.created_at,
            }
            for student_skill, skill in rows
        ]
    
    @staticmethod
    def create_skill(
        db: Session,
        student_id: UUID,
        request: StudentSkillCreate,
    ) -> StudentSkill:

        # Find the master skill using the name provided by frontend
        skill = (
            db.query(Skill)
            .filter(Skill.skill_name == request.skill_name)
            .first()
        )

        if not skill:
            raise ValueError("Skill not found")

        # Check if student already has this skill
        existing = StudentSkillRepository.get_by_skill(
            db,
            student_id,
            skill.skill_id,
        )

        if existing:
            raise ValueError(
                "Student already has this skill"
            )

        # Create student skill using the backend-resolved skill_id
        student_skill = StudentSkill(
            student_id=student_id,
            skill_id=skill.skill_id,
            proficiency_level=request.proficiency_level,
            years_of_experience=request.years_of_experience,
        )

        StudentSkillRepository.create(
            db,
            student_skill,
        )

        # Return response with skill_name instead of exposing skill_id
        return {
        "student_skill_id": student_skill.student_skill_id,
        "student_id": student_skill.student_id,
        "skill_id": skill.skill_id,
        "skill_name": skill.skill_name,
        "proficiency_level": student_skill.proficiency_level,
        "years_of_experience": student_skill.years_of_experience,
        "created_at": student_skill.created_at,
    }
    @staticmethod
    def update_skill(
        db: Session,
        student_id: UUID,
        student_skill_id: UUID,
        request: StudentSkillCreate,
    ) -> StudentSkillResponse:

        student_skill = StudentSkillRepository.get_by_id(
            db,
            student_skill_id,
            student_id,
        )

        if not student_skill:
            raise ValueError("Student skill not found")

        skill = (
            db.query(Skill)
            .filter(Skill.skill_name == request.skill_name.strip())
            .first()
        )

        if not skill:
            raise ValueError("Skill not found")

        existing = StudentSkillRepository.get_by_skill(
            db,
            student_id,
            skill.skill_id,
        )

        if (
            existing
            and existing.student_skill_id != student_skill_id
        ):
            raise ValueError("Student already has this skill")

        student_skill.skill_id = skill.skill_id
        student_skill.proficiency_level = request.proficiency_level
        student_skill.years_of_experience = request.years_of_experience

        db.commit()
        db.refresh(student_skill)

        return StudentSkillResponse(
            student_skill_id=student_skill.student_skill_id,
            student_id=student_skill.student_id,
            skill_id=student_skill.skill_id,
            skill_name=skill.skill_name,
            proficiency_level=student_skill.proficiency_level,
            years_of_experience=student_skill.years_of_experience,
            created_at=student_skill.created_at,
        )

    @staticmethod
    def delete_skill(
        db: Session,
        student_id: UUID,
        student_skill_id: UUID,
    ) -> None:

        student_skill = StudentSkillRepository.get_by_id(
            db,
            student_skill_id,
            student_id,
        )

        if not student_skill:
            raise ValueError("Student skill not found")

        StudentSkillRepository.delete(
            db,
            student_skill,
        )

    # ---------------------------------------------------------
    # STUDENT PROJECTS
    # ---------------------------------------------------------

    @staticmethod
    def get_projects(
        db: Session,
        student_id: UUID,
    ) -> list[Project]:

        return ProjectRepository.get_by_student(
            db,
            student_id,
        )

    @staticmethod
    def create_project(
        db: Session,
        student_id: UUID,
        request: ProjectCreate,
    ) -> Project:

        project = Project(
            student_id=student_id,
            title=request.title,
            description=request.description,
            github_url=request.github_url,
            live_demo_url=request.live_demo_url,
            start_date=request.start_date,
            end_date=request.end_date,
        )

        return ProjectRepository.create(
            db,
            project,
        )

    @staticmethod
    def update_project(
        db: Session,
        student_id: UUID,
        project_id: UUID,
        request: ProjectUpdate,
    ) -> Project:

        project = ProjectRepository.get_by_id(
            db,
            project_id,
            student_id,
        )

        if not project:
            raise ValueError("Project not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(project, field, value)

        db.commit()
        db.refresh(project)

        return project

    @staticmethod
    def delete_project(
        db: Session,
        student_id: UUID,
        project_id: UUID,
    ) -> None:

        project = ProjectRepository.get_by_id(
            db,
            project_id,
            student_id,
        )

        if not project:
            raise ValueError("Project not found")

        ProjectRepository.delete(
            db,
            project,
        )

    # ---------------------------------------------------------
    # PROJECT SKILLS
    # ---------------------------------------------------------

    @staticmethod
    def get_project_skills(
        db: Session,
        student_id: UUID,
        project_id: UUID,
    ) -> list[ProjectSkill]:

        project = (
            db.query(Project)
            .filter(
                Project.project_id == project_id,
                Project.student_id == student_id,
            )
            .first()
        )

        if not project:
            raise ValueError("Project not found")

        return ProjectSkillRepository.get_by_project(
            db,
            project_id,
        )

    @staticmethod
    def create_project_skill(
        db: Session,
        student_id: UUID,
        project_id: UUID,
        request: ProjectSkillCreate,
    ) -> ProjectSkill:

        project = (
            db.query(Project)
            .filter(
                Project.project_id == project_id,
                Project.student_id == student_id,
            )
            .first()
        )

        if not project:
            raise ValueError("Project not found")

        skill = (
            db.query(Skill)
            .filter(Skill.skill_id == request.skill_id)
            .first()
        )

        if not skill:
            raise ValueError("Skill not found")

        existing = ProjectSkillRepository.get_existing(
            db,
            project_id,
            request.skill_id,
        )

        if existing:
            raise ValueError(
                "Project already has this skill"
            )

        project_skill = ProjectSkill(
            project_id=project_id,
            skill_id=request.skill_id,
        )

        return ProjectSkillRepository.create(
            db,
            project_skill,
        )

    @staticmethod
    def delete_project_skill(
        db: Session,
        student_id: UUID,
        project_id: UUID,
        project_skill_id: UUID,
    ) -> None:

        project = (
            db.query(Project)
            .filter(
                Project.project_id == project_id,
                Project.student_id == student_id,
            )
            .first()
        )

        if not project:
            raise ValueError("Project not found")

        project_skill = ProjectSkillRepository.get_by_id(
            db,
            project_skill_id,
            project_id,
        )

        if not project_skill:
            raise ValueError("Project skill not found")

        ProjectSkillRepository.delete(
            db,
            project_skill,
        )

    # ---------------------------------------------------------
    # CERTIFICATIONS
    # ---------------------------------------------------------

    @staticmethod
    def get_certifications(
        db: Session,
        student_id: UUID,
    ) -> list[Certification]:

        return CertificationRepository.get_by_student(
            db,
            student_id,
        )

    @staticmethod
    def create_certification(
        db: Session,
        student_id: UUID,
        request: CertificationCreate,
    ) -> Certification:

        certification = Certification(
            student_id=student_id,
            certificate_name=request.certificate_name,
            issuing_organization=request.issuing_organization,
            issue_date=request.issue_date,
            expiry_date=request.expiry_date,
            credential_url=request.credential_url,
            created_at=datetime.utcnow(),
        )

        return CertificationRepository.create(
            db,
            certification,
        )

    @staticmethod
    def update_certification(
        db: Session,
        student_id: UUID,
        certificate_id: UUID,
        request: CertificationUpdate,
    ) -> Certification:

        certification = CertificationRepository.get_by_id(
            db,
            certificate_id,
            student_id,
        )

        if not certification:
            raise ValueError("Certification not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(certification, field, value)

        db.commit()
        db.refresh(certification)

        return certification

    @staticmethod
    def delete_certification(
        db: Session,
        student_id: UUID,
        certificate_id: UUID,
    ) -> None:

        certification = CertificationRepository.get_by_id(
            db,
            certificate_id,
            student_id,
        )

        if not certification:
            raise ValueError("Certification not found")

        CertificationRepository.delete(
            db,
            certification,
        )

    # ---------------------------------------------------------
    # STUDENT INTERNSHIPS
    # ---------------------------------------------------------

    @staticmethod
    def get_internships(
        db: Session,
        student_id: UUID,
    ) -> list[StudentInternship]:

        return (
            db.query(StudentInternship)
            .filter(
                StudentInternship.student_id == student_id
            )
            .order_by(
                StudentInternship.start_date.desc()
            )
            .all()
        )

    @staticmethod
    def create_internship(
        db: Session,
        student_id: UUID,
        request: StudentInternshipCreate,
    ) -> StudentInternship:

        internship = StudentInternship(
            student_id=student_id,
            company_name=request.company_name,
            role_title=request.role_title,
            location=request.location,
            start_date=request.start_date,
            end_date=request.end_date,
            is_current=request.is_current,
            description=request.description,
            certificate_url=request.certificate_url,
        )

        db.add(internship)
        db.commit()
        db.refresh(internship)

        return internship

    @staticmethod
    def update_internship(
        db: Session,
        student_id: UUID,
        internship_id: UUID,
        request: StudentInternshipUpdate,
    ) -> StudentInternship:

        internship = (
            db.query(StudentInternship)
            .filter(
                StudentInternship.internship_id == internship_id,
                StudentInternship.student_id == student_id,
            )
            .first()
        )

        if not internship:
            raise ValueError("Internship not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(internship, field, value)

        db.commit()
        db.refresh(internship)

        return internship

    @staticmethod
    def delete_internship(
        db: Session,
        student_id: UUID,
        internship_id: UUID,
    ) -> None:

        internship = (
            db.query(StudentInternship)
            .filter(
                StudentInternship.internship_id == internship_id,
                StudentInternship.student_id == student_id,
            )
            .first()
        )

        if not internship:
            raise ValueError("Internship not found")

        db.delete(internship)
        db.commit()

    # ---------------------------------------------------------
    # STUDENT ACHIEVEMENTS
    # ---------------------------------------------------------

    @staticmethod
    def get_achievements(
        db: Session,
        student_id: UUID,
    ) -> list[StudentAchievement]:

        return (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.student_id == student_id
            )
            .order_by(
                StudentAchievement.achievement_date.desc()
            )
            .all()
        )

    @staticmethod
    def create_achievement(
        db: Session,
        student_id: UUID,
        request: StudentAchievementCreate,
    ) -> StudentAchievement:

        achievement = StudentAchievement(
            student_id=student_id,
            title=request.title,
            description=request.description,
            issuing_organization=request.issuing_organization,
            achievement_date=request.achievement_date,
            credential_url=request.credential_url,
        )

        db.add(achievement)
        db.commit()
        db.refresh(achievement)

        return achievement

    @staticmethod
    def update_achievement(
        db: Session,
        student_id: UUID,
        achievement_id: UUID,
        request: StudentAchievementUpdate,
    ) -> StudentAchievement:

        achievement = (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.achievement_id == achievement_id,
                StudentAchievement.student_id == student_id,
            )
            .first()
        )

        if not achievement:
            raise ValueError("Achievement not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(achievement, field, value)

        db.commit()
        db.refresh(achievement)

        return achievement

    @staticmethod
    def delete_achievement(
        db: Session,
        student_id: UUID,
        achievement_id: UUID,
    ) -> None:

        achievement = (
            db.query(StudentAchievement)
            .filter(
                StudentAchievement.achievement_id == achievement_id,
                StudentAchievement.student_id == student_id,
            )
            .first()
        )

        if not achievement:
            raise ValueError("Achievement not found")

        db.delete(achievement)
        db.commit()

    # ---------------------------------------------------------
    # STUDENT SOCIAL LINKS
    # ---------------------------------------------------------

    @staticmethod
    def get_social_links(
        db: Session,
        student_id: UUID,
    ) -> list[StudentSocialLink]:

        return (
            db.query(StudentSocialLink)
            .filter(
                StudentSocialLink.student_id == student_id
            )
            .order_by(
                StudentSocialLink.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def create_social_link(
        db: Session,
        student_id: UUID,
        request: StudentSocialLinkCreate,
    ) -> StudentSocialLink:

        social_link = StudentSocialLink(
            student_id=student_id,
            platform=request.platform,
            profile_url=request.profile_url,
        )

        db.add(social_link)
        db.commit()
        db.refresh(social_link)

        return social_link

    @staticmethod
    def update_social_link(
        db: Session,
        student_id: UUID,
        social_link_id: UUID,
        request: StudentSocialLinkUpdate,
    ) -> StudentSocialLink:

        social_link = (
            db.query(StudentSocialLink)
            .filter(
                StudentSocialLink.social_link_id == social_link_id,
                StudentSocialLink.student_id == student_id,
            )
            .first()
        )

        if not social_link:
            raise ValueError("Social link not found")

        update_data = request.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(social_link, field, value)

        db.commit()
        db.refresh(social_link)

        return social_link

    @staticmethod
    def delete_social_link(
        db: Session,
        student_id: UUID,
        social_link_id: UUID,
    ) -> None:

        social_link = (
            db.query(StudentSocialLink)
            .filter(
                StudentSocialLink.social_link_id == social_link_id,
                StudentSocialLink.student_id == student_id,
            )
            .first()
        )

        if not social_link:
            raise ValueError("Social link not found")

        db.delete(social_link)
        db.commit()

    # ---------------------------------------------------------
    # STUDENT RESUMES
    # ---------------------------------------------------------

    @staticmethod
    def get_resumes(
        db: Session,
        student_id: UUID,
    ) -> list[Resume]:

        return ResumeRepository.get_by_student(
            db,
            student_id,
        )

    @staticmethod
    def get_resume(
        db: Session,
        student_id: UUID,
        resume_id: UUID,
    ) -> Resume | None:

        return ResumeRepository.get_by_id(
            db,
            resume_id,
            student_id,
        )

    @staticmethod
    def create_resume(
        db: Session,
        student_id: UUID,
        filename: str,
        content_type: str | None,
        file_bytes: bytes,
    ) -> tuple[Resume, str]:

        file_size = len(file_bytes)

        ResumeService.validate_pdf(
            filename,
            content_type,
            file_size,
        )

        version = (
            ResumeRepository.get_latest_version(
                db,
                student_id,
            )
            + 1
        )

        storage_path = ResumeService.save_file(
            file_bytes,
            filename,
            str(student_id),
            version,
        )

        resume = Resume(
            student_id=student_id,
            resume_file_name=filename,
            resume_storage_path=storage_path,
            mime_type=content_type,
            file_size_kb=round(file_size / 1024),
            version=version,
            is_default=(version == 1),
            uploaded_at=datetime.utcnow(),
        )

        created_resume = ResumeRepository.create(
            db,
            resume,
        )

        # Extract immediately so the upload workflow validates
        # that the PDF can actually be processed.
        extracted_text = ResumeService.extract_text(
            storage_path,
        )

        return created_resume, extracted_text

    @staticmethod
    def delete_resume(
        db: Session,
        student_id: UUID,
        resume_id: UUID,
    ) -> None:

        resume = ResumeRepository.get_by_id(
            db,
            resume_id,
            student_id,
        )

        if not resume or resume.student_id != student_id:
            raise ValueError("Resume not found")

        storage_path = resume.resume_storage_path

        ResumeRepository.delete(
            db,
            resume,
        )

        try:
            from pathlib import Path

            file_path = Path(storage_path)

            if file_path.exists():
                file_path.unlink()

        except Exception:
            pass