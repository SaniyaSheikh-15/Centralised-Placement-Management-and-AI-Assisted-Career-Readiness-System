import { NextResponse } from "next/server";
import { addApplication, getApplicationByDrive, getDrive, getEligibility, listApplications } from "@/lib/placement-store";
import { ApplicationRecord } from "@/types/placement";
import { isDeadlineClosed } from "@/lib/placement-utils";

interface RouteContext {
  params: { driveId: string };
}

export async function POST(_request: Request, { params }: RouteContext) {
  const { driveId } = params;
  const drive = getDrive(driveId);
  if (!drive) {
    return NextResponse.json({ message: "Drive not found." }, { status: 404 });
  }

  if (isDeadlineClosed(drive.applicationDeadline) || drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED") {
    return NextResponse.json({ message: "Application window has closed." }, { status: 422 });
  }

  const existing = getApplicationByDrive(driveId);
  if (existing) {
    return NextResponse.json({ message: "You have already applied to this drive.", application: existing }, { status: 409 });
  }

  const eligibility = getEligibility(driveId);
  if (eligibility?.status === "NOT_ELIGIBLE") {
    return NextResponse.json({ message: "Application cannot be submitted because you are not eligible.", eligibility }, { status: 422 });
  }

  const application: ApplicationRecord = {
    id: `app_${driveId}_${String(listApplications().length + 1).padStart(3, "0")}`,
    applicationId: `APP-2026-${String(listApplications().length + 142).padStart(5, "0")}`,
    driveId: drive.id,
    companyName: drive.companyName,
    companyLogo: drive.companyLogo,
    role: drive.title,
    appliedAt: new Date().toISOString(),
    status: "APPLIED",
    nextStep: "Eligibility Verification",
    nextStepDate: undefined,
    resumeName: "Aafreen_Khan_Resume.pdf",
    timeline: [
      { stage: "APPLIED", label: "Applied", status: "CURRENT", description: "Your application was submitted successfully.", date: new Date().toISOString() },
      { stage: "ELIGIBILITY_VERIFIED", label: "Eligibility Verified", status: "UPCOMING", description: "The backend will validate your profile." },
      { stage: "SHORTLISTED", label: "Shortlisted", status: "UPCOMING", description: "Recruiter review stage." },
      { stage: "ASSESSMENT", label: "Assessment", status: "UPCOMING", description: "Assessment stage." },
      { stage: "TECHNICAL_INTERVIEW", label: "Technical Interview", status: "UPCOMING", description: "Technical interview stage." },
      { stage: "HR_INTERVIEW", label: "HR Interview", status: "UPCOMING", description: "HR interview stage." },
      { stage: "SELECTED", label: "Selected", status: "UPCOMING", description: "Final hiring decision." }
    ]
  };

  addApplication(application);
  return NextResponse.json({ message: "Application submitted successfully.", application }, { status: 201 });
}
