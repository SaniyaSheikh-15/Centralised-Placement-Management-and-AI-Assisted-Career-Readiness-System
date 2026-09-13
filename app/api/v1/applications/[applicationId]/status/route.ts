import { NextResponse } from "next/server";
import { ApplicationServiceError, getApplicationStatus, updateStatus } from "@/lib/application-management-service";
import { parseStatusUpdateRequest, RequestValidationError } from "@/lib/application-management-schemas";

interface RouteContext { params: Promise<{ applicationId: string }>; }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { applicationId } = await params;
    return NextResponse.json({ application: getApplicationStatus(applicationId) });
  } catch (error) {
    return errorResponse(error, "Unable to retrieve application status.");
  }
}

/** Placement officer or Eligibility Engine lifecycle update endpoint. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const role = request.headers.get("x-actor-role");
  if (role !== "PLACEMENT_OFFICER" && role !== "ELIGIBILITY_ENGINE") {
    return NextResponse.json({ message: "Only placement officers or the Eligibility Engine can update application status." }, { status: 403 });
  }
  try {
    const payload = await parseStatusUpdateRequest(request);
    if (role === "ELIGIBILITY_ENGINE" && !payload.eligibilityResult) {
      return NextResponse.json({ message: "Eligibility Engine updates must include eligibilityResult." }, { status: 422 });
    }
    const source = role === "ELIGIBILITY_ENGINE" ? "ELIGIBILITY_ENGINE" : "PLACEMENT_OFFICER";
    const { applicationId } = await params;
    return NextResponse.json({ message: "Application status updated.", application: updateStatus(applicationId, payload, source) });
  } catch (error) {
    return errorResponse(error, "Unable to update application status.");
  }
}

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof RequestValidationError) return NextResponse.json({ message: error.message }, { status: 400 });
  if (error instanceof ApplicationServiceError) return NextResponse.json({ message: error.message }, { status: error.statusCode });
  return NextResponse.json({ message: fallback }, { status: 500 });
}
