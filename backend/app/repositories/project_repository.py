from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.student import Project


class ProjectRepository:

    @staticmethod
    def get_by_student(db: Session, student_id: UUID) -> list[Project]:
        print("GET PROJECTS STUDENT ID:", student_id)

        projects = (
            db.query(Project)
            .filter(Project.student_id == student_id)
            .order_by(Project.created_at.desc())
            .all()
        )

        print("PROJECTS FOUND:", projects)

        return projects

    @staticmethod
    def get_by_id(
        db: Session,
        project_id: UUID,
        student_id: UUID,
    ) -> Project | None:
        return (
            db.query(Project)
            .filter(
                Project.project_id == project_id,
                Project.student_id == student_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        project: Project,
    ) -> Project:
        db.add(project)
        db.commit()
        db.refresh(project)

        return project

    @staticmethod
    def delete(
        db: Session,
        project: Project,
    ) -> None:
        db.delete(project)
        db.commit()