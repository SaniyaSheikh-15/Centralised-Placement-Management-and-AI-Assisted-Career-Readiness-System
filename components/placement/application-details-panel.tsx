"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApplicationStatusBadge } from "@/components/placement/application-status-badge";
import { ApplicationTimeline } from "@/components/placement/application-timeline";
import { WithdrawApplicationButton } from "@/components/placement/withdraw-application-button";
import { apiRequest, ApplicationResponse } from "@/lib/application-management-client";
import { formatDate, formatTime } from "@/lib/placement-utils";
import type { ApplicationRecord } from "@/types/placement";

export function ApplicationDetailsPanel({ applicationId }: { applicationId: string }) {
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplication = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<ApplicationResponse>(`/api/v1/applications/${encodeURIComponent(applicationId)}`);
      setApplication(result.application);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load this application.");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => { void loadApplication(); }, [loadApplication]);

  if (loading) return <div role="status" className="panel p-6 text-sm text-slate-300">Loading application…</div>;
  if (error || !application) return <section role="alert" className="panel space-y-4 p-6"><p className="text-sm text-rose-300">{error ?? "Application not found."}</p><div className="flex gap-3"><button onClick={() => void loadApplication()} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Try again</button><Link href="/student/applications" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white">Back to applications</Link></div></section>;

  return <div className="space-y-6">
    <section className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/95 p-6">
      <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{application.companyName}</p><h2 className="font-heading mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">{application.role}</h2><p className="mt-3 text-sm text-slate-400">Application ID: {application.applicationId}</p></div><ApplicationStatusBadge status={application.status} /></div>
    </section>
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5"><div className="grid gap-4 md:grid-cols-2"><InfoCard label="Applied On" value={`${formatDate(application.appliedAt)} · ${formatTime(application.appliedAt)}`} /><InfoCard label="Resume" value={application.resumeName ?? "Not available"} /><InfoCard label="Next Step" value={application.nextStep ?? "No action required at this time."} /><InfoCard label="Next Step Date" value={application.nextStepDate ? `${formatDate(application.nextStepDate)} · ${formatTime(application.nextStepDate)}` : "—"} /></div></div>
        <ApplicationTimeline timeline={application.timeline ?? []} />
      </div>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5"><h3 className="text-xl font-semibold text-white">Next Action</h3><p className="mt-3 text-sm leading-6 text-slate-400">{application.nextStep ? `Your next step is ${application.nextStep}.` : "No action required at this time."}</p>{application.nextStepDate ? <div className="mt-4 rounded-[22px] border border-slate-800/80 bg-slate-950/70 p-4"><p className="text-[13px] text-slate-400">Scheduled</p><p className="mt-2 text-base font-semibold text-white">{formatDate(application.nextStepDate)}</p><p className="text-[13px] text-slate-400">{formatTime(application.nextStepDate)}</p></div> : null}<Link href={`/student/placement-drives/${application.driveId}`} className="mt-4 inline-flex rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">View Drive</Link></section>
        <section className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5"><h3 className="text-xl font-semibold text-white">Actions</h3><p className="mt-3 text-sm text-slate-400">If backend rules allow withdrawal, use the button below to withdraw this application.</p><div className="mt-4"><WithdrawApplicationButton applicationId={application.id} disabled={application.status === "WITHDRAWN" || application.status === "SELECTED" || application.status === "REJECTED"} onWithdraw={setApplication} /></div></section>
      </div>
    </section>
  </div>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[22px] border border-slate-800/80 bg-slate-950/70 p-4"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-lg font-semibold text-white">{value}</p></div>;
}
