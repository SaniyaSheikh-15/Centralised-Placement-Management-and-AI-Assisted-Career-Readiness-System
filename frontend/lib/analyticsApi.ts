const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function analyticsFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" &&
      data !== null &&
      "detail" in data &&
      typeof data.detail === "string"
        ? data.detail
        : `Analytics API request failed (${response.status})`;

    throw new Error(errorMessage);
  }

  return data as T;
}

/* =========================================================
   TYPES
========================================================= */

export type AnalyticsOverview = {
  total_students: number;
  eligible_students: number;
  active_drives: number;
  total_applications: number;
  students_placed: number;
  placement_rate: number;
};

export type PlacementSummary = {
  students_placed: number;
  placement_rate: number;
  average_package: number | null;
  highest_package: number | null;
  lowest_package: number | null;
};

export type CompanyHiring = {
  company_name: string;
  students_placed: number;
  average_package: number | null;
};

export type DepartmentPlacement = {
  department: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

export type YearPlacement = {
  graduation_year: number;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

export type ApplicationSummary = {
  total_applications: number;
  selected_applications: number;
  selection_rate: number;
};

export type HiringTrend = {
  month: string;
  applications: number;
  selections: number;
};

export type SalaryDistribution = {
  salary_range: string;
  students: number;
};

export type RoleOffer = {
  role: string;
  offers: number;
};

export type CompanyRecruitmentTrend = {
  month: string;
  company_name: string;
  recruitments: number;
};

export type HiringUpdate = {
  company: string;
  selected: number;
};

export type EligibleStudent = {
  student_id: string;
  student_name: string;
  department: string;
  branch?: string | null;
  cgpa: number | null;
  eligible_drives: number;
  applications: number;
  interview_status: string | null;
  placement_status: string | null;
  company?: string | null;
  academic_year?: string | null;
};

/* =========================================================
   API FUNCTIONS
========================================================= */

export async function getOverview(): Promise<AnalyticsOverview> {
  return analyticsFetch<AnalyticsOverview>(
    "/analytics/overview"
  );
}

export async function getPlacements(): Promise<PlacementSummary> {
  return analyticsFetch<PlacementSummary>(
    "/analytics/placements"
  );
}

export async function getApplications(): Promise<ApplicationSummary> {
  return analyticsFetch<ApplicationSummary>(
    "/analytics/applications"
  );
}

export async function getHiringTrends(): Promise<HiringTrend[]> {
  return analyticsFetch<HiringTrend[]>(
    "/analytics/hiring-trends"
  );
}

export async function getDepartmentWise(): Promise<
  DepartmentPlacement[]
> {
  return analyticsFetch<DepartmentPlacement[]>(
    "/analytics/department-wise"
  );
}

export async function getYearWise(): Promise<YearPlacement[]> {
  return analyticsFetch<YearPlacement[]>(
    "/analytics/year-wise"
  );
}

export async function getCompanyWise(): Promise<CompanyHiring[]> {
  return analyticsFetch<CompanyHiring[]>(
    "/analytics/company-wise"
  );
}

export async function getSalaryDistribution(): Promise<
  SalaryDistribution[]
> {
  return analyticsFetch<SalaryDistribution[]>(
    "/analytics/salary-distribution"
  );
}

export async function getRoleOffers(): Promise<RoleOffer[]> {
  return analyticsFetch<RoleOffer[]>(
    "/analytics/role-offers"
  );
}

export async function getCompanyRecruitmentTrends(): Promise<
  CompanyRecruitmentTrend[]
> {
  return analyticsFetch<CompanyRecruitmentTrend[]>(
    "/analytics/company-recruitment-trends"
  );
}

export async function getHiringUpdates(): Promise<HiringUpdate[]> {
  return analyticsFetch<HiringUpdate[]>(
    "/analytics/hiring-updates"
  );
}

export type EligibleStudentFilters = {
  department?: string;
  min_cgpa?: number;
  company?: string;
  branch?: string;
  placement_status?: string;
  academic_year?: string;
};

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
    params.set(
      "placement_status",
      filters.placement_status
    );
  }

  if (filters.academic_year) {
    params.set(
      "academic_year",
      filters.academic_year
    );
  }

  const query = params.toString();

  return analyticsFetch<EligibleStudent[]>(
    `/analytics/eligible-students${query ? `?${query}` : ""}`
  );
}