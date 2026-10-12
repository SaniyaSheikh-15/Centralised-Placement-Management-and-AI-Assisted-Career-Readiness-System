"use client";

import { useCallback, useEffect, useState } from "react";
import { ApplicationTable } from "@/components/placement/application-table";
import { apiRequest, ApplicationsResponse } from "@/lib/application-management-client";
import type { ApplicationRecord } from "@/types/placement";

export function ApplicationsPanel() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<ApplicationsResponse>("/api/v1/applications/me");
      setApplications(result.applications);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadApplications(); }, [loadApplications]);

  const summary = [
    { label: "Total Applications", value: applications.length },
    { label: "Under Review", value: applications.filter((item) => item.status === "APPLIED" || item.status === "ELIGIBILITY_VERIFIED").length },
    { label: "Interviews", value: applications.filter((item) => item.status === "ASSESSMENT" || item.status === "TECHNICAL_INTERVIEW" || item.status === "HR_INTERVIEW").length },
    { label: "Selected", value: applications.filter((item) => item.status === "SELECTED").length },
    { label: "Rejected", value: applications.filter((item) => item.status === "REJECTED").length }
  ];

  if (loading) return <div role="status" className="panel p-6 text-sm text-slate-300">Loading your applications…</div>;
  if (error) return <div role="alert" className="panel space-y-4 p-6"><p className="text-sm text-rose-300">{error}</p><button onClick={() => void loadApplications()} className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Try again</button></div>;

  return <>
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {summary.map((item) => <div key={item.label} className="panel-soft px-4 py-4"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{item.label}</p><p className="mt-2 text-[24px] font-semibold text-white">{item.value}</p></div>)}
    </section>
    <section className="panel px-5 py-5">
      <h3 className="text-base font-semibold text-white">Applications</h3>
      <p className="mt-1 text-[13px] leading-6 text-slate-400">Statuses and next steps are kept in one simple table.</p>
      <div className="mt-4"><ApplicationTable applications={applications} /></div>
    </section>
  </>;
}
