import { ApplicationStatus, DriveStatus, EligibilityStatus, RequirementStatus } from "@/types/placement";
import { humanizeApplicationStatus, humanizeDriveStatus, humanizeEligibilityStatus, humanizeRequirementStatus } from "@/lib/placement-utils";

type StatusValue = DriveStatus | EligibilityStatus | ApplicationStatus | RequirementStatus;

interface StatusBadgeProps {
  status: StatusValue;
  label?: string;
  tone?: "drive" | "eligibility" | "application" | "requirement";
}

export function StatusBadge({ status, label, tone = "drive" }: StatusBadgeProps) {
  const toneClass = {
    drive: driveTone(status as DriveStatus),
    eligibility: eligibilityTone(status as EligibilityStatus),
    application: applicationTone(status as ApplicationStatus),
    requirement: requirementTone(status as RequirementStatus)
  }[tone];

  const text =
    label ??
    (tone === "drive"
      ? humanizeDriveStatus(status as DriveStatus)
      : tone === "eligibility"
      ? humanizeEligibilityStatus(status as EligibilityStatus)
      : tone === "application"
      ? humanizeApplicationStatus(status as ApplicationStatus)
      : humanizeRequirementStatus(status as RequirementStatus));

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>{text}</span>;
}

function driveTone(status: DriveStatus) {
  switch (status) {
    case "PUBLISHED":
    case "ONGOING":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "REGISTRATION_CLOSED":
      return "border-slate-500/40 bg-slate-500/10 text-slate-300";
    case "COMPLETED":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "CANCELLED":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    default:
      return "border-slate-500/40 bg-slate-500/10 text-slate-300";
  }
}

function eligibilityTone(status: EligibilityStatus) {
  switch (status) {
    case "ELIGIBLE":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "PARTIALLY_ELIGIBLE":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "NOT_ELIGIBLE":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "PENDING_VERIFICATION":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
  }
}

function applicationTone(status: ApplicationStatus) {
  switch (status) {
    case "SELECTED":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "REJECTED":
    case "WITHDRAWN":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "TECHNICAL_INTERVIEW":
    case "HR_INTERVIEW":
      return "border-violet-400/30 bg-violet-400/10 text-violet-300";
    case "ASSESSMENT":
    case "SHORTLISTED":
    case "ELIGIBILITY_VERIFIED":
      return "border-sky-400/30 bg-sky-400/10 text-sky-300";
    case "APPLIED":
    default:
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
  }
}

function requirementTone(status: RequirementStatus) {
  switch (status) {
    case "PASSED":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "FAILED":
      return "border-rose-400/30 bg-rose-400/10 text-rose-300";
    case "PARTIAL":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "OPTIONAL":
      return "border-slate-500/40 bg-slate-500/10 text-slate-300";
  }
}
