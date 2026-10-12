import type { EligibilityResult, PlacementDrive } from "@/types/placement";

export interface BackendDrive {
  drive_id: string;
  company_id: string;
  company_name?: string | null;
  company_logo?: string | null;
  company_industry?: string | null;
  company_description?: string | null;
  company_website?: string | null;
  role_title?: string | null;
  drive_title?: string | null;
  job_description?: string | null;
  employment_type?: string | null;
  work_mode?: string | null;
  location?: string | null;
  minimum_package_lpa?: number | string | null;
  maximum_package_lpa?: number | string | null;
  vacancies?: number | null;
  registration_deadline?: string | null;
  drive_date?: string | null;
  status?: string | null;
  eligibility_rule?: {
    minimum_cgpa?: number | string | null;
    maximum_backlogs?: number | null;
    graduation_year?: number | null;
    minimum_tenth_percentage?: number | string | null;
    minimum_twelfth_percentage?: number | string | null;
  } | null;
  drive_branches?: Array<{ branch_id: string; branch_name?: string | null }>;
  drive_skills?: Array<{ skill_id: string; skill_name?: string | null; minimum_proficiency?: string | null }>;
}

export interface EligibilityApiResponse {
  drive_id: string;
  is_eligible: boolean;
  results: Array<{ criterion: string; passed: boolean; message: string }>;
}

export function mapDrive(item: BackendDrive): PlacementDrive {
  const employmentType = item.employment_type?.toUpperCase();
  const workMode = item.work_mode?.toUpperCase();
  return {
    id: item.drive_id,
    companyId: item.company_id,
    companyName: item.company_name ?? "Company",
    companyLogo: item.company_logo ?? undefined,
    companyIndustry: item.company_industry ?? "",
    companyDescription: item.company_description ?? "",
    companyWebsite: item.company_website ?? undefined,
    title: item.role_title ?? item.drive_title ?? "Placement role",
    description: item.job_description ?? "",
    responsibilities: [],
    requiredSkills: (item.drive_skills ?? []).flatMap((skill) => skill.skill_name ? [skill.skill_name] : []),
    preferredSkills: [],
    location: item.location ?? "Location to be announced",
    city: item.location ?? "Location to be announced",
    jobType: employmentType === "INTERNSHIP" ? "INTERNSHIP" : employmentType === "FULL_TIME_WITH_INTERNSHIP" ? "FULL_TIME_WITH_INTERNSHIP" : "FULL_TIME",
    workMode: workMode === "REMOTE" || workMode === "HYBRID" ? workMode : "ON_SITE",
    ctc: formatPackage(item.minimum_package_lpa, item.maximum_package_lpa),
    openings: item.vacancies ?? undefined,
    driveDate: item.drive_date ?? "",
    applicationDeadline: item.registration_deadline ?? "",
    status: item.status?.toLowerCase() === "active" ? "PUBLISHED" : "REGISTRATION_CLOSED",
    selectionProcess: [],
    requirements: mapRequirements(item),
  };
}

export function mapEligibility(result: EligibilityApiResponse): EligibilityResult {
  const passed = result.results.filter((item) => item.passed).length;
  const score = result.results.length ? Math.round((passed / result.results.length) * 100) : result.is_eligible ? 100 : 0;
  return {
    driveId: result.drive_id,
    status: result.is_eligible ? "ELIGIBLE" : "NOT_ELIGIBLE",
    score,
    summary: result.is_eligible ? "You meet the configured eligibility requirements." : "Some configured requirements need attention.",
    missingRequirements: result.results.filter((item) => !item.passed).map((item) => item.criterion),
    guidance: result.results.filter((item) => !item.passed).map((item) => item.message),
    requirements: result.results.map((item) => ({ name: item.criterion, required: "As configured for this drive", actual: null, status: item.passed ? "PASSED" : "FAILED", note: item.message })),
  };
}

function mapRequirements(drive: BackendDrive) {
  const rules = drive.eligibility_rule;
  const requirements = [];
  if (rules?.minimum_cgpa != null) requirements.push({ id: "minimum-cgpa", requirementType: "CGPA" as const, requirementName: "Minimum CGPA", operator: ">=", requiredValue: String(rules.minimum_cgpa), isMandatory: true });
  if (rules?.maximum_backlogs != null) requirements.push({ id: "maximum-backlogs", requirementType: "BACKLOG" as const, requirementName: "Maximum backlogs", operator: "<=", requiredValue: String(rules.maximum_backlogs), isMandatory: true });
  if (rules?.graduation_year != null) requirements.push({ id: "graduation-year", requirementType: "YEAR" as const, requirementName: "Graduation year", operator: "=", requiredValue: String(rules.graduation_year), isMandatory: true });
  for (const branch of drive.drive_branches ?? []) requirements.push({ id: branch.branch_id, requirementType: "BRANCH" as const, requirementName: branch.branch_name ?? "Eligible branch", operator: "=", requiredValue: branch.branch_id, isMandatory: true });
  return requirements;
}

function formatPackage(min?: number | string | null, max?: number | string | null) {
  if (min == null && max == null) return "Not specified";
  if (min != null && max != null && String(min) !== String(max)) return `₹${min}–${max} LPA`;
  return `₹${min ?? max} LPA`;
}
