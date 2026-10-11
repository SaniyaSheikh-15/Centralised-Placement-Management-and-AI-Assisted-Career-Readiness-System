import { NextResponse } from "next/server";
import { getApplication } from "@/lib/placement-store";

interface RouteContext {
  params: { applicationId: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { applicationId } = params;
  const application = getApplication(applicationId);
  if (!application) {
    return NextResponse.json({ message: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({ application });
}
