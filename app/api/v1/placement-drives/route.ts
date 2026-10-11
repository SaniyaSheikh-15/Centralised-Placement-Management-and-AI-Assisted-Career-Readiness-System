import { NextResponse } from "next/server";
import { listApplications, listDrives } from "@/lib/placement-store";
import { filterDrives } from "@/lib/placement-queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    search: url.searchParams.get("search") ?? undefined,
    jobType: url.searchParams.get("jobType") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
    salary: url.searchParams.get("salary") ?? undefined,
    eligibility: url.searchParams.get("eligibility") ?? undefined,
    deadline: url.searchParams.get("deadline") ?? undefined,
    role: url.searchParams.get("role") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined
  };

  const drives = filterDrives(listDrives(), listApplications(), filters);
  return NextResponse.json({ drives });
}
