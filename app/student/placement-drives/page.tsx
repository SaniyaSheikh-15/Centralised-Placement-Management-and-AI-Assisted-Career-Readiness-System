import Link from "next/link";
import { DriveCard } from "@/components/placement/drive-card";
import { DriveFiltersForm } from "@/components/placement/drive-filters";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { getEligibility, getApplicationByDrive, listApplications, listDrives } from "@/lib/placement-store";
import { filterDrives } from "@/lib/placement-queries";
import { isClosingSoon } from "@/lib/placement-utils";

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function PlacementDrivesPage({ searchParams = {} }: PageProps) {
  const params = searchParams;
  const filters = {
    search: valueOf(params.search),
    jobType: valueOf(params.jobType),
    location: valueOf(params.location),
    salary: valueOf(params.salary),
    eligibility: valueOf(params.eligibility),
    deadline: valueOf(params.deadline),
    role: valueOf(params.role),
    sort: valueOf(params.sort)
  };

  const drives = listDrives();
  const applications = listApplications();
  const filtered = filterDrives(drives, applications, filters);

  return (
    <MinimalPage
      eyebrow="Placement Drives"
      title="Explore active placement opportunities that match your profile."
      aside={
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Active Drives" value={drives.filter((drive) => drive.status === "PUBLISHED").length} />
          <Stat label="Eligible Drives" value={drives.filter((drive) => getEligibility(drive.id)?.status === "ELIGIBLE").length} />
          <Stat label="Applied" value={applications.length} />
          <Stat label="Closing Soon" value={drives.filter((drive) => isClosingSoon(drive.applicationDeadline)).length} />
        </div>
      }
    >
      <DriveFiltersForm value={filters} />

      {filtered.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((drive) => {
            const application = getApplicationByDrive(drive.id);
            const eligibility = getEligibility(drive.id);
            const isClosed = drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED";
            const actionHref = application ? `/student/applications/${application.id}` : eligibility?.status === "ELIGIBLE" ? `/student/placement-drives/${drive.id}` : `/student/eligibility?driveId=${drive.id}`;
            const actionLabel = application ? "View Application" : eligibility?.status === "ELIGIBLE" ? "Apply Now" : isClosed ? "Closed" : "View Eligibility";
            const eligibilityLabel = application
              ? "Applied"
              : isClosed
              ? "Closed"
              : eligibility?.status === "ELIGIBLE"
              ? "Eligible"
              : "Review eligibility";

            return <DriveCard key={drive.id} drive={drive} actionHref={actionHref} actionLabel={actionLabel} actionDisabled={isClosed && !application} eligibilityLabel={eligibilityLabel} />;
          })}
        </section>
      ) : (
        <SectionCard title="No placement drives found." subtitle="Try changing your filters or search terms.">
          <Link href="/student/placement-drives" className="inline-flex rounded-[18px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white">
            Clear Filters
          </Link>
        </SectionCard>
      )}
    </MinimalPage>
  );
}

function valueOf(value: string | string[] | undefined) {
  return typeof value === "string" && value.length ? value : undefined;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel-soft px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-[18px] font-semibold text-white">{value}</p>
    </div>
  );
}
