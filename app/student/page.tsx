import Link from "next/link";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { getEligibility, listApplications, listDrives } from "@/lib/placement-store";
import { isClosingSoon } from "@/lib/placement-utils";
import { StatusBadge } from "@/components/placement/status-badge";

export default function StudentDashboardPage() {
  const drives = listDrives();
  const applications = listApplications();
  const eligibleDrives = drives.filter((drive) => getEligibility(drive.id)?.status === "ELIGIBLE").length;
  const activeDrives = drives.filter((drive) => drive.status === "PUBLISHED").length;
  const upcomingInterviews = applications.filter((application) => application.status === "TECHNICAL_INTERVIEW" || application.status === "HR_INTERVIEW" || application.status === "ASSESSMENT").length;

  const applicationPreview = applications.slice(0, 3);
  const readinessDrive = drives[0];
  const readinessEligibility = readinessDrive ? getEligibility(readinessDrive.id) : undefined;
  const readyForNow = drives.filter((drive) => getEligibility(drive.id)?.status === "ELIGIBLE" && drive.status === "PUBLISHED").length;

  return (
    <MinimalPage
      eyebrow=""
      title="Your placement journey, organized from discovery to selection."
      aside={
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300/80">Placement Readiness</p>
            <p className="mt-1 text-base font-semibold text-white">{readyForNow} active drives</p>
            <p className="mt-1 text-[13px] text-slate-400">
              {applications.filter((item) => item.status === "SHORTLISTED" || item.status === "ASSESSMENT" || item.status === "TECHNICAL_INTERVIEW").length} applications are moving forward.
            </p>
          </div>
          <Link href="/student/applications" className="inline-flex rounded-[18px] bg-sky-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-sky-400">
            View Applications
          </Link>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Drives", value: activeDrives },
          { label: "Eligible Drives", value: eligibleDrives },
          { label: "Applied", value: applications.length },
          { label: "Closing Soon", value: drives.filter((drive) => isClosingSoon(drive.applicationDeadline)).length }
        ].map((stat) => (
          <div key={stat.label} className="panel-soft px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
            <p className="mt-2 text-[24px] font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Placement Overview" subtitle={readinessEligibility?.summary ?? "Your profile is ready to start the workflow."}>
          <div className="flex flex-wrap items-center gap-3">
            {readinessEligibility ? <StatusBadge status={readinessEligibility.status} tone="eligibility" /> : null}
            <span className="text-[13px] text-slate-400">{upcomingInterviews} upcoming interviews</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="Eligible for now" value={String(readyForNow)} />
            <Metric label="Applications moving" value={String(applications.filter((item) => item.status === "SHORTLISTED" || item.status === "ASSESSMENT" || item.status === "TECHNICAL_INTERVIEW").length)} />
          </div>
        </SectionCard>

        <SectionCard title="Quick Links" subtitle="Jump back into the workflow.">
          <div className="grid gap-3">
            <Link href="/student/placement-drives" className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-[13px] font-semibold text-white transition hover:border-sky-400/40">
              Browse Placement Drives
            </Link>
            <Link href="/student/eligibility" className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-[13px] font-semibold text-white transition hover:border-sky-400/40">
              Review Eligibility
            </Link>
            <Link href="/student/applications" className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-[13px] font-semibold text-white transition hover:border-sky-400/40">
              Open Applications
            </Link>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Applications" subtitle="The latest activity at a glance.">
        <div className="grid gap-4 lg:grid-cols-3">
          {applicationPreview.map((application) => (
            <Link key={application.id} href={`/student/applications/${application.id}`} className="panel-soft p-4 transition hover:border-sky-400/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-white">{application.companyName}</h4>
                  <p className="text-[13px] text-slate-400">{application.role}</p>
                </div>
                <StatusBadge status={application.status} tone="application" />
              </div>
              <p className="mt-3 text-[13px] text-slate-400">{application.nextStep ?? "No next step available"}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </MinimalPage>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-soft px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-[20px] font-semibold text-white">{value}</p>
    </div>
  );
}
