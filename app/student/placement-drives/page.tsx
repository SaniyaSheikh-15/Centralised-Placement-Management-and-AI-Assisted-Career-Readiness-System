import { MinimalPage } from "@/components/layout/minimal-page";
import { PlacementDrivesPanel } from "@/components/placement/placement-drives-panel";
import type { DriveFilters } from "@/lib/placement-queries";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PlacementDrivesPage({ searchParams }: PageProps) {
  const params = await searchParams ?? {};
  const filters: DriveFilters = {
    search: valueOf(params.search),
    jobType: valueOf(params.jobType),
    location: valueOf(params.location),
    salary: valueOf(params.salary),
    eligibility: valueOf(params.eligibility),
    deadline: valueOf(params.deadline),
    role: valueOf(params.role),
    sort: valueOf(params.sort)
  };

  return (
    <MinimalPage
      eyebrow="Placement Drives"
      title="Explore active placement opportunities that match your profile."
    >
      <PlacementDrivesPanel filters={filters} />
    </MinimalPage>
  );
}

function valueOf(value: string | string[] | undefined) {
  return typeof value === "string" && value.length ? value : undefined;
}
