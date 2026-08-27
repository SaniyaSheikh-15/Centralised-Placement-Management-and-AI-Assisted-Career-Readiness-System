import {
  ApplicationRecord,
  PlacementDrive
} from "@/types/placement";
import { isClosingSoon, isDeadlineClosed } from "@/lib/placement-utils";
import { getEligibility } from "@/lib/placement-store";

export interface DriveFilters {
  search?: string;
  jobType?: string;
  location?: string;
  salary?: string;
  eligibility?: string;
  deadline?: string;
  role?: string;
  sort?: string;
}

export function filterDrives(drives: PlacementDrive[], applications: ApplicationRecord[], filters: DriveFilters) {
  const search = (filters.search ?? "").trim().toLowerCase();

  let filtered = drives.filter((drive) => {
    const matchesSearch =
      !search ||
      [drive.companyName, drive.title, drive.location, drive.city, ...drive.requiredSkills, ...drive.preferredSkills]
        .join(" ")
        .toLowerCase()
        .includes(search);

    const matchesJobType = !filters.jobType || filters.jobType === "all" || drive.jobType === filters.jobType;
    const matchesLocation =
      !filters.location ||
      filters.location === "all" ||
      drive.workMode === filters.location ||
      (filters.location.startsWith("city:") && drive.city.toLowerCase() === filters.location.replace("city:", "").toLowerCase());
    const matchesRole = !filters.role || filters.role === "all" || drive.title.toLowerCase().includes(filters.role.toLowerCase());

    const salaryBand = salaryBucket(drive.ctc);
    const matchesSalary = !filters.salary || filters.salary === "all" || salaryBand === filters.salary;

    const application = applications.find((item) => item.driveId === drive.id);
    const closed = isDeadlineClosed(drive.applicationDeadline) || drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED";
    const eligible = getEligibility(drive.id)?.status === "ELIGIBLE";

    const matchesEligibility =
      !filters.eligibility ||
      filters.eligibility === "all" ||
      (filters.eligibility === "eligible" && eligible && !closed) ||
      (filters.eligibility === "not-eligible" && !eligible && !closed) ||
      (filters.eligibility === "applied" && Boolean(application));

    const closingSoon = isClosingSoon(drive.applicationDeadline);
    const matchesDeadline =
      !filters.deadline ||
      filters.deadline === "all" ||
      (filters.deadline === "closing-today" && sameDay(drive.applicationDeadline)) ||
      (filters.deadline === "closing-soon" && closingSoon) ||
      (filters.deadline === "this-week" && isWithinWeek(drive.applicationDeadline));

    return matchesSearch && matchesJobType && matchesLocation && matchesSalary && matchesEligibility && matchesDeadline && matchesRole;
  });

  if (filters.sort === "deadline") {
    filtered = [...filtered].sort((a, b) => {
      const aTime = new Date(a.applicationDeadline).getTime();
      const bTime = new Date(b.applicationDeadline).getTime();
      return aTime - bTime;
    });
  } else if (filters.sort === "salary") {
    filtered = [...filtered].sort((a, b) => numericCtc(b.ctc) - numericCtc(a.ctc));
  }

  return filtered;
}

function salaryBucket(ctc: string) {
  const value = numericCtc(ctc);
  if (value < 5) return "under-5";
  if (value < 10) return "5-10";
  if (value < 15) return "10-15";
  return "15-plus";
}

function numericCtc(ctc: string) {
  const match = ctc.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? Number(match[1]) : 0;
}

function sameDay(date: string) {
  const input = new Date(date);
  const now = new Date();
  return input.toDateString() === now.toDateString();
}

function isWithinWeek(date: string) {
  const diff = new Date(date).getTime() - Date.now();
  return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
}
