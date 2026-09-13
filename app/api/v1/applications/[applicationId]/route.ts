import { NextResponse } from "next/server";
import { ApplicationServiceError, getApplicationOrThrow } from "@/lib/application-management-service";

interface RouteContext { params: Promise<{ applicationId: string }>; }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { applicationId } = await params;
    return NextResponse.json({ application: getApplicationOrThrow(applicationId) });
  } catch (error) {
    const status = error instanceof ApplicationServiceError ? error.statusCode : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to retrieve application." }, { status });
  }
}
