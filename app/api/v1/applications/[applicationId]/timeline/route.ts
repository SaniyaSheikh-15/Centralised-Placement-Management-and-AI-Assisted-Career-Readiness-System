import { NextResponse } from "next/server";
import { ApplicationServiceError, getApplicationOrThrow } from "@/lib/application-management-service";

interface RouteContext { params: Promise<{ applicationId: string }>; }

/** Returns lifecycle milestones plus immutable status-update history. */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { applicationId } = await params;
    const application = getApplicationOrThrow(applicationId);
    return NextResponse.json({ applicationId: application.applicationId, timeline: application.timeline, history: application.history ?? [] });
  } catch (error) {
    const status = error instanceof ApplicationServiceError ? error.statusCode : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to retrieve application timeline." }, { status });
  }
}
