import { apiRequest } from "./api";

/* =========================================================
   OVERVIEW
========================================================= */

export type AnalyticsOverview = {
  total_students: number;
  eligible_students: number;
  active_drives: number;
  total_applications: number;
  students_placed: number;
  placement_rate: number;
};

export async function getOverview(): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>(
    "/analytics/overview"
  );
}

/* =========================================================
   PLACEMENTS
========================================================= */

export type PlacementSummary = {
  students_placed: number;
  placement_rate: number;
  average_package?: number | null;
  highest_package?: number | null;
  lowest_package?: number | null;
};

export async function getPlacements(): Promise<PlacementSummary> {
  return apiRequest<PlacementSummary>(
    "/analytics/placements"
  );
}

/* =========================================================
   APPLICATIONS
========================================================= */

export type ApplicationSummary = {
  total_applications: number;
  selected_applications: number;
  selection_rate: number;
};

export async function getApplications(): Promise<ApplicationSummary> {
  return apiRequest<ApplicationSummary>(
    "/analytics/applications"
  );
}

/* =========================================================
   HIRING TRENDS
========================================================= */

export type HiringTrend = {
  month: string;
  applications: number;
  selections: number;
};

export async function getHiringTrends(): Promise<HiringTrend[]> {
  return apiRequest<HiringTrend[]>(
    "/analytics/hiring-trends"
  );
}

/* =========================================================
   DEPARTMENT-WISE
========================================================= */

export type DepartmentPlacement = {
  department: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

export async function getDepartmentWise(): Promise<
  DepartmentPlacement[]
> {
  return apiRequest<DepartmentPlacement[]>(
    "/analytics/department-wise"
  );
}

/* =========================================================
   YEAR-WISE
========================================================= */

export type YearPlacement = {
  graduation_year: number;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

export async function getYearWise(): Promise<YearPlacement[]> {
  return apiRequest<YearPlacement[]>(
    "/analytics/year-wise"
  );
}

/* =========================================================
   COMPANY-WISE
========================================================= */

export type CompanyHiring = {
  company_name: string;
  students_placed: number;
  average_package?: number | null;
};

export async function getCompanyWise(): Promise<CompanyHiring[]> {
  return apiRequest<CompanyHiring[]>(
    "/analytics/company-wise"
  );
}

/* =========================================================
   SALARY DISTRIBUTION
========================================================= */

export type SalaryDistribution = {
  salary_range: string;
  students: number;
};

export async function getSalaryDistribution(): Promise<
  SalaryDistribution[]
> {
  return apiRequest<SalaryDistribution[]>(
    "/analytics/salary-distribution"
  );
}

/* =========================================================
   ROLE OFFERS
========================================================= */

export type RoleOffer = {
  role: string;
  offers: number;
};

export async function getRoleOffers(): Promise<RoleOffer[]> {
  return apiRequest<RoleOffer[]>(
    "/analytics/role-offers"
  );
}

/* =========================================================
   COMPANY RECRUITMENT TRENDS
========================================================= */

export type CompanyRecruitmentTrend = {
  month: string;
  company_name: string;
  recruitments: number;
};

export async function getCompanyRecruitmentTrends(): Promise<
  CompanyRecruitmentTrend[]
> {
  return apiRequest<CompanyRecruitmentTrend[]>(
    "/analytics/company-recruitment-trends"
  );
}

/* =========================================================
   HIRING UPDATES
========================================================= */

export type HiringUpdate = {
  company: string;
  selected: number;
};

export async function getHiringUpdates(): Promise<HiringUpdate[]> {
  return apiRequest<HiringUpdate[]>(
    "/analytics/hiring-updates"
  );
}

/* =========================================================
   PLACEMENT INSIGHTS
========================================================= */

export type PlacementInsights = {
  placement_performance: string[];
  attention_required: string[];
  recommendations: string[];
};

export async function getPlacementInsights(): Promise<PlacementInsights> {
  return apiRequest<PlacementInsights>(
    "/analytics/placement-insights"
  );
}

/* =========================================================
   ELIGIBLE STUDENTS
========================================================= */

export type EligibleStudent = {
  student_id: string;
  student_name: string;
  department: string;
  branch?: string | null;
  cgpa?: number | null;
  company?: string | null;
  academic_year?: string | null;
  eligible_drives: number;
  applications: number;
  interview_status?: string | null;
  placement_status?: string | null;
};

/* =========================================================
   ELIGIBLE STUDENT FILTERS
========================================================= */

export interface EligibleStudentFilters {
  department?: string;
  min_cgpa?: number;
  company?: string;
  branch?: string;
  placement_status?: string;
  academic_year?: string;
}

/* =========================================================
   GET ELIGIBLE STUDENTS
========================================================= */

export async function getEligibleStudents(
  filters: EligibleStudentFilters = {}
): Promise<EligibleStudent[]> {
  const params = new URLSearchParams();

  if (filters.department) {
    params.set("department", filters.department);
  }

  if (filters.min_cgpa !== undefined) {
    params.set("min_cgpa", String(filters.min_cgpa));
  }

  if (filters.company) {
    params.set("company", filters.company);
  }

  if (filters.branch) {
    params.set("branch", filters.branch);
  }

  if (filters.placement_status) {
    params.set("placement_status", filters.placement_status);
  }

  if (filters.academic_year) {
    params.set("academic_year", filters.academic_year);
  }

  const queryString = params.toString();

  const endpoint =
    queryString.length > 0
      ? `/analytics/eligible-students?${queryString}`
      : "/analytics/eligible-students";

  return apiRequest<EligibleStudent[]>(endpoint);
}