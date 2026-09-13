import { ApplicationStatus } from "@/types/placement";

const statuses: ApplicationStatus[] = [
  "APPLIED", "ELIGIBILITY_VERIFIED", "SHORTLISTED", "ASSESSMENT",
  "TECHNICAL_INTERVIEW", "HR_INTERVIEW", "SELECTED", "REJECTED", "WITHDRAWN"
];

export interface ApplyRequest {
  resumeName?: string;
}

export interface StatusUpdateRequest {
  status?: ApplicationStatus;
  remarks?: string;
  scheduledAt?: string;
  /** Result supplied by the Eligibility Engine; this module does not calculate it. */
  eligibilityResult?: "ELIGIBLE" | "NOT_ELIGIBLE";
}

export class RequestValidationError extends Error {}

export async function parseApplyRequest(request: Request): Promise<ApplyRequest> {
  if (request.headers.get("content-length") === "0") return {};
  const body = await parseJson(request);
  if (body.resumeName !== undefined && (typeof body.resumeName !== "string" || body.resumeName.trim().length === 0)) {
    throw new RequestValidationError("resumeName must be a non-empty string when provided.");
  }
  return { resumeName: body.resumeName?.trim() };
}

export async function parseStatusUpdateRequest(request: Request): Promise<StatusUpdateRequest> {
  const body = await parseJson(request);
  if (body.status !== undefined && (!isString(body.status) || !statuses.includes(body.status as ApplicationStatus))) {
    throw new RequestValidationError("status must be a valid application lifecycle status.");
  }
  if (body.eligibilityResult !== undefined && body.eligibilityResult !== "ELIGIBLE" && body.eligibilityResult !== "NOT_ELIGIBLE") {
    throw new RequestValidationError("eligibilityResult must be ELIGIBLE or NOT_ELIGIBLE.");
  }
  if (!body.status && !body.eligibilityResult) {
    throw new RequestValidationError("Provide status or eligibilityResult.");
  }
  if (body.remarks !== undefined && (!isString(body.remarks) || body.remarks.length > 1000)) {
    throw new RequestValidationError("remarks must be a string of at most 1000 characters.");
  }
  if (body.scheduledAt !== undefined && (!isString(body.scheduledAt) || Number.isNaN(Date.parse(body.scheduledAt)))) {
    throw new RequestValidationError("scheduledAt must be a valid ISO-8601 date.");
  }
  return body as StatusUpdateRequest;
}

async function parseJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new RequestValidationError("Request body must be a JSON object.");
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
