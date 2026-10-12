"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DriveCard } from "@/components/placement/drive-card";
import { DriveFiltersForm } from "@/components/placement/drive-filters";
import { SectionCard } from "@/components/layout/minimal-page";
import { apiRequest, ApplicationsResponse } from "@/lib/application-management-client";
import { mapDrive, BackendDrive } from "@/lib/placement-api";
import { filterDrives, DriveFilters } from "@/lib/placement-queries";
import { isClosingSoon } from "@/lib/placement-utils";
import type { ApplicationRecord, PlacementDrive } from "@/types/placement";

interface DriveListResponse { drives: BackendDrive[]; total: number; }

export function PlacementDrivesPanel({ filters }: { filters: DriveFilters }) {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [driveResponse, applicationResponse] = await Promise.all([
        apiRequest<DriveListResponse>("/api/v1/placement-drives?page=1&page_size=100"),
        apiRequest<ApplicationsResponse>("/api/v1/applications/me"),
      ]);
      setDrives(driveResponse.drives.map(mapDrive));
      setApplications(applicationResponse.applications);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load placement drives.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div role="status" className="panel p-6 text-sm text-slate-300">Loading placement drives…</div>;
  if (error) return <section role="alert" className="panel space-y-4 p-6"><p className="text-sm text-rose-300">{error}</p><button onClick={() => void load()} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Try again</button></section>;

  const filtered = filterDrives(drives, applications, filters);
  const active = drives.filter((drive) => drive.status === "PUBLISHED").length;
  const closingSoon = drives.filter((drive) => isClosingSoon(drive.applicationDeadline)).length;

  return <>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Active Drives" value={active} />
      <Stat label="Eligible Drives" value="Open a drive to check" />
      <Stat label="Applied" value={applications.length} />
      <Stat label="Closing Soon" value={closingSoon} />
    </section>
    <DriveFiltersForm value={filters} />
    {filtered.length ? <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((drive) => {
        const application = applications.find((item) => item.driveId === drive.id);
        const closed = drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED" || !drive.applicationDeadline || new Date(drive.applicationDeadline).getTime() < Date.now();
        return <DriveCard key={drive.id} drive={drive} actionHref={application ? `/student/applications/${application.id}` : `/student/placement-drives/${drive.id}`} actionLabel={application ? "View Application" : closed ? "Closed" : "View Drive"} actionDisabled={closed && !application} eligibilityLabel={application ? "Applied" : closed ? "Closed" : "Check eligibility"} />;
      })}
    </section> : <SectionCard title="No placement drives found." subtitle="Try changing your filters or search terms."><Link href="/student/placement-drives" className="inline-flex rounded-[18px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white">Clear Filters</Link></SectionCard>}
  </>;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="panel-soft px-4 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p><p className="mt-2 text-[18px] font-semibold text-white">{value}</p></div>;
}
