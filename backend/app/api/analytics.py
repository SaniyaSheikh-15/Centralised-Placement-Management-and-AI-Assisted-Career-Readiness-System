from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.analytics import (
    AnalyticsOverview,
    ApplicationSummary,
    CompanyHiring,
    CompanyRecruitmentTrend,
    DepartmentPlacement,
    DriveStatistics,
    EligibleStudent,
    HiringTrend,
    HiringUpdate,
    PlacementInsights,
    PlacementSummary,
    RoleOffer,
    SalaryDistribution,
    YearPlacement,
)

from app.services.analytics_service import (
    get_applications,
    get_company_recruitment_trends,
    get_company_wise,
    get_department_wise,
    get_drive_statistics,
    get_eligible_students,
    get_hiring_trends,
    get_hiring_updates,
    get_overview,
    get_placements,
    get_placement_insights,
    get_role_offers,
    get_salary_distribution,
    get_year_wise,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


# ---------------------------------------------------------
# OVERVIEW
# ---------------------------------------------------------

@router.get(
    "/overview",
    response_model=AnalyticsOverview,
    summary="Get placement dashboard overview",
)
def overview(
    db: Session = Depends(get_db),
):
    return get_overview(db)


# ---------------------------------------------------------
# PLACEMENTS
# ---------------------------------------------------------

@router.get(
    "/placements",
    response_model=PlacementSummary,
    summary="Get placement and salary statistics",
)
def placements(
    db: Session = Depends(get_db),
):
    return get_placements(db)


# ---------------------------------------------------------
# APPLICATIONS
# ---------------------------------------------------------

@router.get(
    "/applications",
    response_model=ApplicationSummary,
    summary="Get application and selection statistics",
)
def applications(
    db: Session = Depends(get_db),
):
    return get_applications(db)


# ---------------------------------------------------------
# HIRING TRENDS
# ---------------------------------------------------------

@router.get(
    "/hiring-trends",
    response_model=List[HiringTrend],
    summary="Get monthly hiring trends",
)
def hiring_trends(
    db: Session = Depends(get_db),
):
    return get_hiring_trends(db)


# ---------------------------------------------------------
# DEPARTMENT-WISE
# ---------------------------------------------------------

@router.get(
    "/department-wise",
    response_model=List[DepartmentPlacement],
    summary="Get department-wise placement statistics",
)
def department_wise(
    db: Session = Depends(get_db),
):
    return get_department_wise(db)


# ---------------------------------------------------------
# YEAR-WISE
# ---------------------------------------------------------

@router.get(
    "/year-wise",
    response_model=List[YearPlacement],
    summary="Get year-wise placement statistics",
)
def year_wise(
    db: Session = Depends(get_db),
):
    return get_year_wise(db)


# ---------------------------------------------------------
# COMPANY-WISE
# ---------------------------------------------------------

@router.get(
    "/company-wise",
    response_model=List[CompanyHiring],
    summary="Get company-wise hiring statistics",
)
def company_wise(
    db: Session = Depends(get_db),
):
    return get_company_wise(db)


# ---------------------------------------------------------
# ELIGIBLE STUDENTS
# ---------------------------------------------------------

@router.get(
    "/eligible-students",
    response_model=List[EligibleStudent],
    summary="Get eligible students with optional filters",
)
def eligible_students(
    department: Optional[str] = Query(
        default=None,
        description="Filter by department",
    ),
    min_cgpa: Optional[float] = Query(
        default=None,
        ge=0,
        le=10,
        description="Minimum CGPA",
    ),
    company: Optional[str] = Query(
        default=None,
        description="Filter by company",
    ),
    branch: Optional[str] = Query(
        default=None,
        description="Filter by branch code or branch name",
    ),
    placement_status: Optional[str] = Query(
        default=None,
        description="Filter by placement status",
    ),
    academic_year: Optional[str] = Query(
        default=None,
        pattern=r"^\d{4}-\d{2}$",
        description="Academic year such as 2026-27",
    ),
    db: Session = Depends(get_db),
):
    return get_eligible_students(
        db=db,
        department=department,
        min_cgpa=min_cgpa,
        company=company,
        branch=branch,
        placement_status=placement_status,
        academic_year=academic_year,
    )


# ---------------------------------------------------------
# SALARY DISTRIBUTION
# ---------------------------------------------------------

@router.get(
    "/salary-distribution",
    response_model=List[SalaryDistribution],
    summary="Get salary distribution",
)
def salary_distribution(
    db: Session = Depends(get_db),
):
    return get_salary_distribution(db)


# ---------------------------------------------------------
# ROLE OFFERS
# ---------------------------------------------------------

@router.get(
    "/role-offers",
    response_model=List[RoleOffer],
    summary="Get offers by job role",
)
def role_offers(
    db: Session = Depends(get_db),
):
    return get_role_offers(db)


# ---------------------------------------------------------
# COMPANY RECRUITMENT TRENDS
# ---------------------------------------------------------

@router.get(
    "/company-recruitment-trends",
    response_model=List[CompanyRecruitmentTrend],
    summary="Get company-wise recruitment trends",
)
def company_recruitment_trends(
    db: Session = Depends(get_db),
):
    return get_company_recruitment_trends(db)


# ---------------------------------------------------------
# HIRING UPDATES
# ---------------------------------------------------------

@router.get(
    "/hiring-updates",
    response_model=List[HiringUpdate],
    summary="Get latest hiring updates",
)
def hiring_updates(
    db: Session = Depends(get_db),
):
    return get_hiring_updates(db)


# ---------------------------------------------------------
# DRIVE STATISTICS
# ---------------------------------------------------------

@router.get(
    "/drive-statistics",
    response_model=List[DriveStatistics],
    summary="Get placement drive statistics",
)
def drive_statistics(
    db: Session = Depends(get_db),
):
    return get_drive_statistics(db)


# ---------------------------------------------------------
# PLACEMENT INSIGHTS
# ---------------------------------------------------------

@router.get(
    "/placement-insights",
    response_model=PlacementInsights,
    summary="Generate rule-based placement insights",
)
def placement_insights(
    db: Session = Depends(get_db),
):
    return get_placement_insights(db)