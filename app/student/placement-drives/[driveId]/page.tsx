import Link from "next/link";
import { notFound } from "next/navigation";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { ApplyDialog } from "@/components/placement/apply-dialog";
import { DeadlineBadge } from "@/components/placement/deadline-badge";
import { EligibilityBreakdown } from "@/components/placement/eligibility-breakdown";
import { StatusBadge } from "@/components/placement/status-badge";
import { getApplicationByDrive, getDrive, getEligibility } from "@/lib/placement-store";
import { formatDate, humanizeJobType, humanizeWorkMode, isDeadlineClosed } from "@/lib/placement-utils";

interface PageProps {
  params: { driveId: string };
}

export default function DriveDetailsPage({ params }: PageProps) {
  const { driveId } = params;
  const drive = getDrive(driveId);
  if (!drive) {
    notFound();
  }

  const eligibility = getEligibility(drive.id);
  const application = getApplicationByDrive(drive.id);
  const closed = isDeadlineClosed(drive.applicationDeadline) || drive.status === "REGISTRATION_CLOSED" || drive.status === "CANCELLED";

  return (
    <MinimalPage
      eyebrow="Placement Drive"
      title={`${drive.companyName} · ${drive.title}`}
      description={drive.companyDescription}
      aside={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-slate-400">
            {drive.companyIndustry} · {drive.city}
          </span>
          <StatusBadge status={drive.status} tone="drive" />
          <DeadlineBadge deadline={drive.applicationDeadline} />
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="CTC" value={drive.ctc} />
        <InfoCard label="Location" value={drive.location} />
        <InfoCard label="Job Type" value={`${humanizeJobType(drive.jobType)} · ${humanizeWorkMode(drive.workMode)}`} />
        <InfoCard label="Drive Date" value={formatDate(drive.driveDate)} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard title="About the Role" subtitle={drive.description}>
            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Responsibilities</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {drive.responsibilities.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Selection Process">
            <div className="mt-5 grid gap-3">
              {drive.selectionProcess.map((stage, index) => (
                <div key={stage.name} className="panel-soft p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Stage {index + 1}</p>
                      <h4 className="mt-1 text-[15px] font-semibold text-white">{stage.name}</h4>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        stage.status === "COMPLETED"
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : stage.status === "CURRENT"
                          ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
                          : "border-slate-500/40 bg-slate-500/10 text-slate-300"
                      }`}
                    >
                      {humanizeStageStatus(stage.status ?? "UPCOMING")}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] text-slate-400">{stage.description}</p>
                  {stage.expectedDate ? <p className="mt-2 text-[13px] text-slate-500">Expected: {formatDate(stage.expectedDate)}</p> : null}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Required Skills">
            <div className="mt-4 flex flex-wrap gap-2">
              {drive.requiredSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[13px] text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
            <h4 className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Preferred Skills</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {drive.preferredSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[13px] text-slate-400">
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Eligibility Preview">
            {eligibility ? (
              <div className="mt-4 space-y-4">
                <div className="grid gap-3 text-sm text-slate-300">
                  {eligibility.requirements.slice(0, 4).map((requirement) => (
                    <div key={requirement.name} className="flex items-center justify-between rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3">
                      <span>{requirement.name}</span>
                      <span className={requirement.status === "FAILED" ? "text-rose-300" : "text-emerald-300"}>
                        {requirement.status === "FAILED" ? "✗" : "✓"} {requirement.status === "FAILED" ? "Needs attention" : "Satisfied"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="panel-soft p-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Eligibility Score</p>
                  <p className="mt-2 text-[24px] font-semibold text-white">{eligibility.score}%</p>
                </div>
                <Link href={`/student/eligibility?driveId=${drive.id}`} className="inline-flex rounded-[18px] bg-sky-500 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400">
                  View Full Eligibility
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Eligibility results will appear here once the backend responds.</p>
            )}
          </SectionCard>

          <SectionCard title="Apply">
            <p className="mt-2 text-sm text-slate-400">
              {application
                ? "You have already submitted this application. Use the application page to track the latest status."
                : closed
                ? "The application window for this drive is closed."
                : "Submit your application after reviewing the requirements and your eligibility result."}
            </p>
            <div className="mt-4">
              <ApplyDialog
                driveId={drive.id}
                companyName={drive.companyName}
                role={drive.title}
                resumeName="Aafreen_Khan_Resume.pdf"
                deadlineLabel={formatDate(drive.applicationDeadline)}
                disabled={closed || Boolean(application)}
                disabledReason={application ? "You have already applied to this drive." : "This drive is no longer accepting applications."}
              />
            </div>
            {application ? (
              <Link href={`/student/applications/${application.id}`} className="mt-4 inline-flex rounded-[18px] border border-slate-800/60 px-4 py-3 text-[13px] font-semibold text-white transition hover:border-sky-400/40 hover:bg-slate-950">
                View Application
              </Link>
            ) : null}
          </SectionCard>
        </div>
      </section>
    </MinimalPage>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-soft p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-[15px] font-semibold text-white">{value}</p>
    </div>
  );
}

function humanizeStageStatus(status: string) {
  return {
    COMPLETED: "Completed",
    CURRENT: "Current",
    UPCOMING: "Upcoming"
  }[status] ?? status;
}
