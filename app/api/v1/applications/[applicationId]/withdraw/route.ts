import { NextResponse } from "next/server";
import { ApplicationServiceError, withdrawApplication } from "@/lib/application-management-service";

interface RouteContext { params: Promise<{ applicationId: string }>; }

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    const { applicationId } = await params;
    return NextResponse.json({ message: "Application withdrawn successfully.", application: withdrawApplication(applicationId) });
  } catch (error) {
    const status = error instanceof ApplicationServiceError ? error.statusCode : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to withdraw application." }, { status });
  }
}
