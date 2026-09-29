/* =========================================================
   ANALYTICS API
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

/* =========================================================
   API REQUEST HELPER
========================================================= */

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let message =
      `API request failed: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return response.json();
}

/* =========================================================
   TYPES
========================================================= */

/* -------------------------
   OVERVIEW
------------------------- */

export type AnalyticsOverview = {
  total_students: number;
  eligible_students: number;
  total_applications: number;
  students_placed: number;
  placement_rate: number;
  active_drives: number;
};

/* -------------------------
   PLACEMENTS
------------------------- */

export type PlacementSummary = {
  students_placed: number;
  placement_rate: number;
  average_package?: number | null;
  highest_package?: number | null;
  lowest_package?: number | null;
};

/* -------------------------
   APPLICATIONS
------------------------- */

export type ApplicationSummary = {
  total_applications: number;
  shortlisted: number;
  selected: number;
  rejected: number;
  pending: number;
};

/* -------------------------
   HIRING TRENDS
------------------------- */

export type HiringTrend = {
  month: string;
  applications: number;
  selections: number;
};

/* -------------------------
   DEPARTMENT-WISE
------------------------- */

export type DepartmentPlacement = {
  department: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

/* -------------------------
   BRANCH-WISE
------------------------- */

export type BranchPlacement = {
  branch: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

/* -------------------------
   YEAR-WISE
------------------------- */

export type YearPlacement = {
  graduation_year: number;
  total_students: number;
  students_placed: number;
  placement_rate: number;
};

/* -------------------------
   COMPANY-WISE
------------------------- */

export type CompanyHiring = {
  company_name: string;
  students_placed: number;
};

/* -------------------------
   SALARY DISTRIBUTION
------------------------- */

export type SalaryDistribution = {
  salary_range: string;
  students: number;
};

/* -------------------------
   ROLE OFFERS
------------------------- */

export type RoleOffer = {
  role: string;
  offers: number;
};

/* -------------------------
   COMPANY RECRUITMENT TRENDS
------------------------- */

export type CompanyRecruitmentTrend = {
  month: string;
  company_name: string;
  students_placed: number;
};

/* -------------------------
   HIRING UPDATES
------------------------- */

export type HiringUpdate = {
  company: string;
  selected: number;
};

/* -------------------------
   ELIGIBLE STUDENTS
------------------------- */

export type EligibleStudent = {
  student_id: number | string;
  student_name: string;
  department: string;
  branch: string;
  cgpa: number;
  eligible_drives: number;
  applications: number;
  interview_status: string;
  placement_status: string;
  company?: string | null;
  academic_year?: string | null;
};

/* =========================================================
   OVERVIEW
========================================================= */

export async function getOverview(): Promise<AnalyticsOverview> {
  return apiRequest<AnalyticsOverview>(
    "/analytics/overview"
  );
}

/* =========================================================
   PLACEMENTS
========================================================= */

export async function getPlacements(): Promise<PlacementSummary> {
  return apiRequest<PlacementSummary>(
    "/analytics/placements"
  );
}

/* =========================================================
   APPLICATIONS
========================================================= */

export async function getApplications(): Promise<ApplicationSummary> {
  return apiRequest<ApplicationSummary>(
    "/analytics/applications"
  );
}

/* =========================================================
   HIRING TRENDS
========================================================= */

export async function getHiringTrends(): Promise<HiringTrend[]> {
  return apiRequest<HiringTrend[]>(
    "/analytics/hiring-trends"
  );
}

/* =========================================================
   DEPARTMENT-WISE PLACEMENT
========================================================= */

export async function getDepartmentWise(): Promise<
  DepartmentPlacement[]
> {
  return apiRequest<DepartmentPlacement[]>(
    "/analytics/department-wise"
  );
}

/* =========================================================
   BRANCH-WISE PLACEMENT
========================================================= */

export async function getBranchWise(): Promise<
  BranchPlacement[]
> {
  return apiRequest<BranchPlacement[]>(
    "/analytics/branch-wise"
  );
}

/* =========================================================
   YEAR-WISE PLACEMENT
========================================================= */

export async function getYearWise(): Promise<
  YearPlacement[]
> {
  return apiRequest<YearPlacement[]>(
    "/analytics/year-wise"
  );
}

/* =========================================================
   COMPANY-WISE HIRING
========================================================= */

export async function getCompanyWise(): Promise<
  CompanyHiring[]
> {
  return apiRequest<CompanyHiring[]>(
    "/analytics/company-wise"
  );
}

/* =========================================================
   SALARY DISTRIBUTION
========================================================= */

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

export async function getRoleOffers(): Promise<
  RoleOffer[]
> {
  return apiRequest<RoleOffer[]>(
    "/analytics/role-offers"
  );
}

/* =========================================================
   COMPANY RECRUITMENT TRENDS
========================================================= */

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

export async function getHiringUpdates(): Promise<
  HiringUpdate[]
> {
  return apiRequest<HiringUpdate[]>(
    "/analytics/hiring-updates"
  );
}

/* =========================================================
   ELIGIBLE STUDENTS
========================================================= */

export async function getEligibleStudents(): Promise<
  EligibleStudent[]
> {
  return apiRequest<EligibleStudent[]>(
    "/analytics/eligible-students"
  );
}