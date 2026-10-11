export type DriveJobType = "FULL_TIME" | "INTERNSHIP" | "FULL_TIME_WITH_INTERNSHIP";
export type DriveWorkMode = "ON_SITE" | "REMOTE" | "HYBRID";
export type DriveStatus = "PUBLISHED" | "REGISTRATION_CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type EligibilityStatus = "ELIGIBLE" | "PARTIALLY_ELIGIBLE" | "NOT_ELIGIBLE" | "PENDING_VERIFICATION";
export type RequirementStatus = "PASSED" | "FAILED" | "PARTIAL" | "OPTIONAL";

export type ApplicationStatus =
  | "APPLIED"
  | "ELIGIBILITY_VERIFIED"
  | "SHORTLISTED"
  | "ASSESSMENT"
  | "TECHNICAL_INTERVIEW"
  | "HR_INTERVIEW"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface DriveRequirement {
  id: string;
  requirementType: "CGPA" | "BACKLOG" | "DEGREE" | "BRANCH" | "YEAR" | "SKILL" | "CERTIFICATION" | "EXPERIENCE";
  requirementName: string;
  operator: string;
  requiredValue: string;
  isMandatory: boolean;
}

export interface SelectionStage {
  name: string;
  description: string;
  expectedDate?: string;
  status?: "UPCOMING" | "CURRENT" | "COMPLETED" | "SKIPPED";
  actionLabel?: string;
  actionHref?: string;
}

export interface PlacementDrive {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyIndustry: string;
  companyDescription: string;
  companyWebsite?: string;
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  location: string;
  city: string;
  jobType: DriveJobType;
  workMode: DriveWorkMode;
  ctc: string;
  openings?: number;
  driveDate: string;
  applicationDeadline: string;
  status: DriveStatus;
  selectionProcess: SelectionStage[];
  requirements: DriveRequirement[];
}

export interface EligibilityRequirementResult {
  name: string;
  required: string;
  actual: string | number | null;
  status: RequirementStatus;
  note?: string;
}

export interface EligibilityResult {
  driveId: string;
  status: EligibilityStatus;
  score: number;
  summary: string;
  missingRequirements: string[];
  guidance: string[];
  requirements: EligibilityRequirementResult[];
}

export interface ApplicationTimelineItem {
  stage: ApplicationStatus;
  label: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING" | "REJECTED" | "WITHDRAWN";
  description: string;
  date?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface ApplicationRecord {
  id: string;
  applicationId: string;
  driveId: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  appliedAt: string;
  status: ApplicationStatus;
  nextStep?: string;
  nextStepDate?: string;
  resumeName?: string;
  timeline: ApplicationTimelineItem[];
}

export interface StudentProfile {
  id: string;
  name: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: number;
  backlogs: number;
  skills: string[];
  certifications: string[];
  resumeName?: string;
}
