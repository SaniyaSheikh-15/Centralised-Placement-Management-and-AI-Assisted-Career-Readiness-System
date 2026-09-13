import { NextResponse } from "next/server";
import { createApplication, ApplicationServiceError } from "@/lib/application-management-service";
import { parseApplyRequest, RequestValidationError } from "@/lib/application-management-schemas";

interface RouteContext { params: Promise<{ driveId: string }>; }

/** Apply to a placement drive for the authenticated student (mock: student_001). */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const payload = await parseApplyRequest(request);
    const { driveId } = await params;
    const application = createApplication("student_001", driveId, payload);
    return NextResponse.json({ message: "Application submitted successfully.", application }, { status: 201 });
  } catch (error) {
    if (error instanceof RequestValidationError) return NextResponse.json({ message: error.message }, { status: 400 });
    if (error instanceof ApplicationServiceError) return NextResponse.json({ message: error.message }, { status: error.statusCode });
    return NextResponse.json({ message: "Unable to submit application." }, { status: 500 });
  }
}
