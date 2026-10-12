"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { ApplyDialog } from "@/components/placement/apply-dialog";
import { DeadlineBadge } from "@/components/placement/deadline-badge";
import { EligibilityBreakdown } from "@/components/placement/eligibility-breakdown";
import { StatusBadge } from "@/components/placement/status-badge";
import { apiRequest, ApplicationsResponse } from "@/lib/application-management-client";
import { BackendDrive, EligibilityApiResponse, mapDrive, mapEligibility } from "@/lib/placement-api";
import { formatDate, humanizeJobType, humanizeWorkMode } from "@/lib/placement-utils";
import type { ApplicationRecord, EligibilityResult } from "@/types/placement";

interface BackendDriveDetails extends BackendDrive {
  eligibility_rule?: BackendDrive["eligibility_rule"];
  drive_branches?: BackendDrive["drive_branches"];
  drive_skills?: BackendDrive["drive_skills"];
}

export function PlacementDriveDetailsPanel({ driveId }: { driveId: string }) {
  const [drive, setDrive] = useState<ReturnType<typeof mapDrive> | null>(null);
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawDrive = await apiRequest<BackendDriveDetails>(`/api/v1/placement-drives/${encodeURIComponent(driveId)}`);
      setDrive(mapDrive(rawDrive));
      const [applicationsResult, eligibilityResult] = await Promise.allSettled([
        apiRequest<ApplicationsResponse>("/api/v1/applications/me"),
        apiRequest<EligibilityApiResponse>(`/api/v1/placement-drives/${encodeURIComponent(driveId)}/eligibility/evaluate`, { method: "POST" }),
      ]);
      if (applicationsResult.status === "fulfilled") {
        setApplication(applicationsResult.value.applications.find((item) => item.driveId === driveId) ?? null);
      }
      if (eligibilityResult.status === "fulfilled") setEligibility(mapEligibility(eligibilityResult.value));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load this placement drive.");
    } finally {
      setLoading(false);
    }
  }, [driveId]);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <div role="status" className="panel p-6 text-sm text-slate-300">Loading placement drive…</div>;
  if (error || !drive) return <section role="alert" className="panel space-y-4 p-6"><p className="text-sm text-rose-300">{error ?? "Placement drive not found."}</p><div className="flex gap-3"><button onClick={() => void load()} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Try again</button><Link href="/student/placement-drives" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white">Back to drives</Link></div></section>;

  const closed = drive.status !== "PUBLISHED" || !drive.applicationDeadline || new Date(drive.applicationDeadline).getTime() < Date.now();
  const ctc = drive.ctc;

  return <MinimalPage eyebrow="Placement Drive" title={`${drive.companyName} · ${drive.title}`} description={drive.companyDescription} aside={<div className="flex flex-wrap items-center gap-3"><span className="text-[13px] text-slate-400">{drive.companyIndustry} · {drive.city}</span><StatusBadge status={drive.status} tone="drive" />{drive.applicationDeadline ? <DeadlineBadge deadline={drive.applicationDeadline} /> : null}</div>}>
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <InfoCard label="CTC" value={ctc} /><InfoCard label="Location" value={drive.location} /><InfoCard label="Job Type" value={`${humanizeJobType(drive.jobType)} · ${humanizeWorkMode(drive.workMode)}`} /><InfoCard label="Drive Date" value={drive.driveDate ? formatDate(drive.driveDate) : "Not announced"} />
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <SectionCard title="About the Role" subtitle={drive.description || "No role description was provided."}><p className="mt-4 text-[13px] text-slate-400">{drive.openings ? `${drive.openings} openings` : "Openings not specified"}</p></SectionCard>
        <SectionCard title="Selection Process"><p className="text-sm text-slate-400">Selection stages will appear here when the backend provides them.</p></SectionCard>
      </div>
      <div className="space-y-6">
        <SectionCard title="Required Skills">{drive.requiredSkills.length ? <div className="mt-4 flex flex-wrap gap-2">{drive.requiredSkills.map((skill) => <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[13px] text-slate-200">{skill}</span>)}</div> : <p className="mt-3 text-sm text-slate-400">No required skills were provided.</p>}</SectionCard>
        <SectionCard title="Eligibility Preview">{eligibility ? <EligibilityBreakdown result={eligibility} /> : <p className="mt-3 text-sm text-slate-400">Eligibility details are not available for this drive.</p>}</SectionCard>
        <SectionCard title="Apply">
          <p className="mt-2 text-sm text-slate-400">{application ? "You have already submitted this application. Track its latest status below." : closed ? "This drive is not currently accepting applications." : "Submit your application using your saved default resume."}</p>
          <div className="mt-4"><ApplyDialog driveId={drive.id} companyName={drive.companyName} role={drive.title} deadlineLabel={drive.applicationDeadline ? formatDate(drive.applicationDeadline) : "No deadline set"} disabled={closed || Boolean(application)} disabledReason={application ? "You have already applied to this drive." : "This drive is not accepting applications."} /></div>
          {application ? <Link href={`/student/applications/${application.id}`} className="mt-4 inline-flex rounded-[18px] border border-slate-800/60 px-4 py-3 text-[13px] font-semibold text-white transition hover:border-sky-400/40 hover:bg-slate-950">View Application</Link> : null}
        </SectionCard>
      </div>
    </section>
  </MinimalPage>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="panel-soft p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p><p className="mt-2 text-[15px] font-semibold text-white">{value}</p></div>;
}
