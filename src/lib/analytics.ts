import { apiFetch } from "@/lib/api/client";

/* Analytics API response types — aligned with the FastAPI schemas. */

export interface AnalyticsOverview {
  total_students: number;
  eligible_students: number;
  active_drives: number;
  total_applications: number;
  students_placed: number;
  placement_rate: number;
}

export interface PlacementSummary {
  students_placed: number;
  placement_rate: number;
  average_package?: number | null;
  highest_package?: number | null;
  lowest_package?: number | null;
}

export interface ApplicationSummary {
  total_applications: number;
  selected_applications: number;
  selection_rate: number;
}

export interface HiringTrend {
  month: string;
  applications: number;
  selections: number;
}

export interface DepartmentPlacement {
  department: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
}

export interface BranchPlacement {
  branch: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
}

export interface YearPlacement {
  graduation_year: number;
  total_students: number;
  students_placed: number;
  placement_rate: number;
}

export interface CompanyHiring {
  company_name: string;
  students_placed: number;
  average_package?: number | null;
}

export interface SalaryDistribution {
  salary_range: string;
  students: number;
}

export interface RoleOffer {
  role: string;
  offers: number;
}

export interface CompanyRecruitmentTrend {
  month: string;
  company_name: string;
  recruitments: number;
}

export interface HiringUpdate {
  company: string;
  selected: number;
}

export interface EligibleStudent {
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
}

export interface DriveStatistics {
  drive_id: string;
  company_name: string;
  drive_title?: string | null;
  status?: string | null;
  applications: number;
  selected: number;
  selection_rate: number;
  vacancies?: number | null;
}

export interface EligibleStudentFilters {
  department?: string;
  min_cgpa?: number;
  company?: string;
  branch?: string;
  placement_status?: string;
  academic_year?: string;
}

const requestOptions: RequestInit = {
  cache: "no-store",
};

export function getOverview() {
  return apiFetch<AnalyticsOverview>("analytics/overview", requestOptions);
}

export function getPlacements() {
  return apiFetch<PlacementSummary>("analytics/placements", requestOptions);
}

export function getApplications() {
  return apiFetch<ApplicationSummary>("analytics/applications", requestOptions);
}

export function getHiringTrends() {
  return apiFetch<HiringTrend[]>("analytics/hiring-trends", requestOptions);
}

export function getDepartmentWise() {
  return apiFetch<DepartmentPlacement[]>(
    "analytics/department-wise",
    requestOptions
  );
}

export function getBranchWise() {
  return apiFetch<BranchPlacement[]>("analytics/branch-wise", requestOptions);
}

export function getYearWise() {
  return apiFetch<YearPlacement[]>("analytics/year-wise", requestOptions);
}

export function getCompanyWise() {
  return apiFetch<CompanyHiring[]>("analytics/company-wise", requestOptions);
}

export function getSalaryDistribution() {
  return apiFetch<SalaryDistribution[]>(
    "analytics/salary-distribution",
    requestOptions
  );
}

export function getRoleOffers() {
  return apiFetch<RoleOffer[]>("analytics/role-offers", requestOptions);
}

export function getCompanyRecruitmentTrends() {
  return apiFetch<CompanyRecruitmentTrend[]>(
    "analytics/company-recruitment-trends",
    requestOptions
  );
}

export function getHiringUpdates() {
  return apiFetch<HiringUpdate[]>("analytics/hiring-updates", requestOptions);
}

export function getDriveStatistics() {
  return apiFetch<DriveStatistics[]>(
    "analytics/drive-statistics",
    requestOptions
  );
}

export function getEligibleStudents(filters: EligibleStudentFilters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  const endpoint = query
    ? `analytics/eligible-students?${query}`
    : "analytics/eligible-students";

  return apiFetch<EligibleStudent[]>(endpoint, requestOptions);
}
