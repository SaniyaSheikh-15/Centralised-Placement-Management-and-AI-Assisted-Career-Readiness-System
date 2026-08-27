import { NextResponse } from "next/server";
import { listApplications } from "@/lib/placement-store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const company = url.searchParams.get("company");
  const role = url.searchParams.get("role");

  let applications = listApplications();
  if (status) {
    applications = applications.filter((item) => item.status === status);
  }
  if (company) {
    applications = applications.filter((item) => item.companyName.toLowerCase().includes(company.toLowerCase()));
  }
  if (role) {
    applications = applications.filter((item) => item.role.toLowerCase().includes(role.toLowerCase()));
  }

  return NextResponse.json({ applications });
}
