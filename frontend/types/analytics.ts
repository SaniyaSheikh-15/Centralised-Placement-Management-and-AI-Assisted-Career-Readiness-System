
/* =========================================================
   ANALYTICS TYPES
   Centralised Placement Management and
   AI-Assisted Career Readiness System
========================================================= */

/* =========================================================
   OVERVIEW
========================================================= */

export interface AnalyticsOverview {
  total_students: number;
  eligible_students: number;
  active_drives: number;
  total_applications: number;
  students_placed: number;
  placement_rate: number;
}

/* =========================================================
   PLACEMENTS
========================================================= */

export interface PlacementAnalytics {
  students_placed: number;
  lowest_package: number | null;
  average_package: number | null;
  highest_package: number | null;
}

/* =========================================================
   APPLICATIONS
========================================================= */

export interface ApplicationAnalytics {
  total_applications: number;
  selected_applications: number;
  rejected_applications: number;
  pending_applications: number;
  selection_rate: number;
}

/* =========================================================
   HIRING TRENDS
========================================================= */

export interface HiringTrend {
  month: string;
  applications: number;
  selections: number;
  selection_rate: number;
}

/* =========================================================
   DEPARTMENT-WISE ANALYTICS
========================================================= */

export interface DepartmentAnalytics {
  department: string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
}

/* =========================================================
   YEAR-WISE ANALYTICS
========================================================= */

export interface YearAnalytics {
  graduation_year: number | string;
  total_students: number;
  students_placed: number;
  placement_rate: number;
}

/* =========================================================
   COMPANY-WISE ANALYTICS
========================================================= */

export interface CompanyAnalytics {
  company_name: string;
  students_placed: number;
}

/* =========================================================
   SALARY DISTRIBUTION
========================================================= */

export interface SalaryDistribution {
  salary_range: string;
  students: number;
}

/* =========================================================
   ROLE-WISE OFFERS
========================================================= */

export interface RoleOffer {
  role: string;
  offers: number;
}

/* =========================================================
   COMPANY RECRUITMENT TRENDS
========================================================= */

export interface CompanyRecruitmentTrend {
  month: string;
  company_name: string;
  recruitments: number;
}

/* =========================================================
   HIRING UPDATES
========================================================= */

export interface HiringUpdate {
  company: string;
  selected: number;
}

/* =========================================================
   ELIGIBLE STUDENTS
========================================================= */

export interface EligibleStudent {
  student_id: number;
  student_name: string;
  department: string;
  branch: string;
  cgpa: number | null;
  graduation_year: number | null;
  eligible_drives: number;
  applications: number;
  interview_status: string | null;
  placement_status: string | null;
  company: string | null;
}

/* =========================================================
   DRIVE STATISTICS
========================================================= */

export interface DriveStatistics {
  drive_id: number;
  company_name: string;
  drive_title: string;
  status: string;
  applications: number;
  selected: number;
}

/* =========================================================
   PLACEMENT OFFICER ANALYTICS
========================================================= */

export interface PlacementOfficerAnalytics {
  overview: AnalyticsOverview;
  placements: PlacementAnalytics;
  applications: ApplicationAnalytics;
  hiring_trends: HiringTrend[];
  department_wise: DepartmentAnalytics[];
  year_wise: YearAnalytics[];
  company_wise: CompanyAnalytics[];
  salary_distribution: SalaryDistribution[];
  role_offers: RoleOffer[];
  company_recruitment_trends: CompanyRecruitmentTrend[];
  hiring_updates: HiringUpdate[];
  eligible_students: EligibleStudent[];
  drive_statistics?: DriveStatistics[];
}
