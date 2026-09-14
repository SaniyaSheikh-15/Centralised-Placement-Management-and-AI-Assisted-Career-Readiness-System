from typing import List, Optional

from uuid import UUID

from pydantic import BaseModel


class AnalyticsOverview(BaseModel):

    total_students: int

    eligible_students: int

    active_drives: int

    total_applications: int

    students_placed: int

    placement_rate: float


class PlacementSummary(BaseModel):

    students_placed: int

    placement_rate: float

    average_package: Optional[float] = None

    highest_package: Optional[float] = None

    lowest_package: Optional[float] = None


class CompanyHiring(BaseModel):

    company_name: str

    students_placed: int

    average_package: Optional[float] = None


class DepartmentPlacement(BaseModel):

    department: str

    total_students: int

    students_placed: int

    placement_rate: float


class YearPlacement(BaseModel):

    graduation_year: int

    total_students: int

    students_placed: int

    placement_rate: float


class ApplicationSummary(BaseModel):

    total_applications: int

    selected_applications: int

    selection_rate: float


class HiringTrend(BaseModel):

    month: str

    applications: int

    selections: int


class EligibleStudent(BaseModel):

    student_id: UUID

    student_name: str

    department: str

    branch: Optional[str] = None

    cgpa: Optional[float] = None

    company: Optional[str] = None

    academic_year: Optional[str] = None

    eligible_drives: int

    applications: int

    interview_status: Optional[str] = None

    placement_status: Optional[str] = None


class SalaryDistribution(BaseModel):

    salary_range: str

    students: int


class RoleOffer(BaseModel):

    role: str

    offers: int


class CompanyRecruitmentTrend(BaseModel):

    month: str

    company_name: str

    recruitments: int


class HiringUpdate(BaseModel):

    company: str

    selected: int


class DriveStatistics(BaseModel):

    drive_id: UUID

    company_name: str

    drive_title: Optional[str] = None

    status: Optional[str] = None

    applications: int

    selected: int

    selection_rate: float

    vacancies: Optional[int] = None


# =========================================================
# PLACEMENT INSIGHTS
# =========================================================

class PlacementInsights(BaseModel):

    placement_performance: List[str]

    attention_required: List[str]

    recommendations: List[str]