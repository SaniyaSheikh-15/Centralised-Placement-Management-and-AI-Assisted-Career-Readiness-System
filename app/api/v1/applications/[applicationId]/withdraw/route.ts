import { NextResponse } from "next/server";
import { getApplication, updateApplication } from "@/lib/placement-store";

interface RouteContext {
  params: { applicationId: string };
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  const { applicationId } = params;
  const application = getApplication(applicationId);
  if (!application) {
    return NextResponse.json({ message: "Application not found." }, { status: 404 });
  }

  if (application.status === "WITHDRAWN" || application.status === "SELECTED" || application.status === "REJECTED") {
    return NextResponse.json({ message: "This application cannot be withdrawn." }, { status: 409 });
  }

  const updated = updateApplication(applicationId, { status: "WITHDRAWN", nextStep: "Withdrawn" });
  return NextResponse.json({ message: "Application withdrawn successfully.", application: updated }, { status: 200 });
}
