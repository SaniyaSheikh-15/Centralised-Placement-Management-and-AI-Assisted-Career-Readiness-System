import { ApplicationStatus, DriveJobType, DriveStatus, DriveWorkMode, EligibilityStatus, RequirementStatus } from "@/types/placement";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function formatMoney(value: string) {
  return value;
}

export function humanizeJobType(jobType: DriveJobType) {
  return {
    FULL_TIME: "Full Time",
    INTERNSHIP: "Internship",
    FULL_TIME_WITH_INTERNSHIP: "Internship + Full Time"
  }[jobType];
}

export function humanizeWorkMode(workMode: DriveWorkMode) {
  return {
    ON_SITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid"
  }[workMode];
}

export function humanizeDriveStatus(status: DriveStatus) {
  return {
    PUBLISHED: "Open",
    REGISTRATION_CLOSED: "Closed",
    ONGOING: "Ongoing",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled"
  }[status];
}

export function humanizeEligibilityStatus(status: EligibilityStatus) {
  return {
    ELIGIBLE: "Eligible",
    PARTIALLY_ELIGIBLE: "Partially Eligible",
    NOT_ELIGIBLE: "Not Eligible",
    PENDING_VERIFICATION: "Pending Verification"
  }[status];
}

export function humanizeRequirementStatus(status: RequirementStatus) {
  return {
    PASSED: "Passed",
    FAILED: "Failed",
    PARTIAL: "Partial",
    OPTIONAL: "Optional"
  }[status];
}

export function humanizeApplicationStatus(status: ApplicationStatus) {
  return {
    APPLIED: "Applied",
    ELIGIBILITY_VERIFIED: "Eligibility Verified",
    SHORTLISTED: "Shortlisted",
    ASSESSMENT: "Assessment",
    TECHNICAL_INTERVIEW: "Technical Interview",
    HR_INTERVIEW: "HR Interview",
    SELECTED: "Selected",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn"
  }[status];
}

export function isDeadlineClosed(deadline: string) {
  return new Date(deadline).getTime() < Date.now();
}

export function isClosingSoon(deadline: string, thresholdDays = 3) {
  const diff = new Date(deadline).getTime() - Date.now();
  return diff > 0 && diff <= thresholdDays * 24 * 60 * 60 * 1000;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
