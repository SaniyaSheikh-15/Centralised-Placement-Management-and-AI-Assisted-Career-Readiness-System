import { getDrive, getApplication, getApplicationByStudentAndDrive, listApplications, addApplication, updateApplication } from "@/lib/placement-store";
import { isDeadlineClosed, humanizeApplicationStatus } from "@/lib/placement-utils";
import { ApplicationHistoryItem, ApplicationRecord, ApplicationStatus, ApplicationTimelineItem } from "@/types/placement";
import { ApplyRequest, StatusUpdateRequest } from "@/lib/application-management-schemas";

const lifecycle: ApplicationStatus[] = ["APPLIED", "ELIGIBILITY_VERIFIED", "SHORTLISTED", "ASSESSMENT", "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED"];
const terminalStatuses: ApplicationStatus[] = ["SELECTED", "REJECTED", "WITHDRAWN"];

export class ApplicationServiceError extends Error {
  constructor(message: string, public readonly statusCode: number) { super(message); }
}

export function createApplication(studentId: string, driveId: string, request: ApplyRequest): ApplicationRecord {
  const drive = getDrive(driveId);
  if (!drive) throw new ApplicationServiceError("Drive not found.", 404);
  if (isDeadlineClosed(drive.applicationDeadline) || drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED") {
    throw new ApplicationServiceError("Application window has closed.", 422);
  }
  if (getApplicationByStudentAndDrive(studentId, driveId)) {
    throw new ApplicationServiceError("You have already applied to this drive.", 409);
  }

  const now = new Date().toISOString();
  const application: ApplicationRecord = {
    id: `app_${driveId}_${String(listApplications().length + 1).padStart(3, "0")}`,
    applicationId: `APP-2026-${String(listApplications().length + 142).padStart(5, "0")}`,
    driveId: drive.id, companyName: drive.companyName, companyLogo: drive.companyLogo, role: drive.title,
    appliedAt: now, updatedAt: now, status: "APPLIED", nextStep: "Eligibility Verification",
    resumeName: request.resumeName ?? "Aafreen_Khan_Resume.pdf",
    timeline: buildTimeline("APPLIED", now),
    history: [{ id: `${driveId}_history_1`, toStatus: "APPLIED", remarks: "Application submitted.", source: "STUDENT", createdAt: now }]
  };
  addApplication(application);
  return application;
}

export function getStudentApplications(_studentId: string): ApplicationRecord[] {
  return listApplications();
}

export function getApplicationOrThrow(applicationId: string): ApplicationRecord {
  const application = getApplication(applicationId);
  if (!application) throw new ApplicationServiceError("Application not found.", 404);
  return application;
}

export function getApplicationStatus(applicationId: string) {
  const application = getApplicationOrThrow(applicationId);
  return { applicationId: application.applicationId, status: application.status, nextStep: application.nextStep, nextStepDate: application.nextStepDate, updatedAt: application.updatedAt ?? application.appliedAt };
}

export function updateStatus(applicationId: string, request: StatusUpdateRequest, source: ApplicationHistoryItem["source"] = "PLACEMENT_OFFICER"): ApplicationRecord {
  const application = getApplicationOrThrow(applicationId);
  const requestedStatus = request.eligibilityResult === "ELIGIBLE" ? "ELIGIBILITY_VERIFIED" : request.eligibilityResult === "NOT_ELIGIBLE" ? "REJECTED" : request.status;
  if (!requestedStatus) throw new ApplicationServiceError("A status update is required.", 400);
  if (request.status && request.eligibilityResult === "ELIGIBLE" && request.status !== "ELIGIBILITY_VERIFIED") {
    throw new ApplicationServiceError("An eligible result can only advance the application to ELIGIBILITY_VERIFIED.", 422);
  }
  if (request.status && request.eligibilityResult === "NOT_ELIGIBLE" && request.status !== "REJECTED") {
    throw new ApplicationServiceError("A not-eligible result must reject the application.", 422);
  }
  assertTransition(application.status, requestedStatus);
  const now = new Date().toISOString();
  const history: ApplicationHistoryItem[] = [...(application.history ?? []), {
    id: `${application.id}_history_${(application.history?.length ?? 0) + 1}`,
    fromStatus: application.status, toStatus: requestedStatus, remarks: request.remarks?.trim(), source, createdAt: now
  }];
  const timeline = buildTimeline(requestedStatus, now, request.remarks?.trim(), request.scheduledAt);
  const nextStep = terminalStatuses.includes(requestedStatus) ? humanizeApplicationStatus(requestedStatus) : humanizeApplicationStatus(lifecycle[lifecycle.indexOf(requestedStatus) + 1]);
  return updateApplication(applicationId, { status: requestedStatus, timeline, history, updatedAt: now, nextStep, nextStepDate: request.scheduledAt })!;
}

/** Entry point for an async Eligibility Engine callback or queue consumer. */
export function recordEligibilityResult(applicationId: string, eligible: boolean, remarks?: string): ApplicationRecord {
  return updateStatus(applicationId, { eligibilityResult: eligible ? "ELIGIBLE" : "NOT_ELIGIBLE", remarks }, "ELIGIBILITY_ENGINE");
}

export function withdrawApplication(applicationId: string): ApplicationRecord {
  return updateStatus(applicationId, { status: "WITHDRAWN", remarks: "Application withdrawn by student." }, "STUDENT");
}

function assertTransition(current: ApplicationStatus, next: ApplicationStatus) {
  if (current === next) throw new ApplicationServiceError("Application is already in this status.", 409);
  if (terminalStatuses.includes(current)) throw new ApplicationServiceError("A terminal application cannot be updated.", 409);
  if (next === "WITHDRAWN" || next === "REJECTED") return;
  if (next === "ELIGIBILITY_VERIFIED" && current !== "APPLIED") throw new ApplicationServiceError("Eligibility can only be verified after application submission.", 422);
  if (lifecycle.indexOf(next) !== lifecycle.indexOf(current) + 1) throw new ApplicationServiceError(`Invalid lifecycle transition from ${current} to ${next}.`, 422);
}

function buildTimeline(current: ApplicationStatus, timestamp: string, remarks?: string, scheduledAt?: string): ApplicationTimelineItem[] {
  const stages = [...lifecycle];
  if (current === "REJECTED" || current === "WITHDRAWN") stages.push(current);
  const currentIndex = stages.indexOf(current);
  return stages.map((stage, index) => ({
    stage, label: humanizeApplicationStatus(stage),
    status: stage === current ? (stage === "REJECTED" ? "REJECTED" : stage === "WITHDRAWN" ? "WITHDRAWN" : "CURRENT") : index < currentIndex ? "COMPLETED" : "UPCOMING",
    description: stage === current && remarks ? remarks : `${humanizeApplicationStatus(stage)} stage.`,
    date: stage === current ? (scheduledAt ?? timestamp) : undefined
  }));
}
