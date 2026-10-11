import { NextResponse } from "next/server";
import { getEligibility } from "@/lib/placement-store";

interface RouteContext {
  params: { driveId: string };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { driveId } = params;
  const eligibility = getEligibility(driveId);
  if (!eligibility) {
    return NextResponse.json({ message: "Eligibility not found." }, { status: 404 });
  }

  return NextResponse.json({ eligibility });
}
