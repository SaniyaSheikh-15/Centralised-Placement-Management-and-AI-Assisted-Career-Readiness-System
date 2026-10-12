import { NextResponse } from "next/server";
import { getDrive } from "../../../../../lib/placement-store";

interface RouteContext {
  params: Promise<{ driveId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { driveId } = await params;
  const drive = getDrive(driveId);
  if (!drive) {
    return NextResponse.json({ message: "Drive not found." }, { status: 404 });
  }

  return NextResponse.json({ drive });
}
