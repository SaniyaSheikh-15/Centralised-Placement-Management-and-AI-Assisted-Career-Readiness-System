"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApplicationResponse } from "@/lib/application-management-client";

interface ApplyDialogProps {
  driveId: string;
  companyName: string;
  role: string;
  resumeName?: string;
  deadlineLabel: string;
  disabled?: boolean;
  disabledReason?: string;
}

export function ApplyDialog({ driveId, companyName, role, resumeName, deadlineLabel, disabled, disabledReason }: ApplyDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const buttonLabel = useMemo(() => {
    if (disabled) {
      return disabledReason ?? "Closed";
    }
    return "Apply Now";
  }, [disabled, disabledReason]);

  async function submitApplication() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = await apiRequest<ApplicationResponse>(`/api/v1/placement-drives/${driveId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      setOpen(false);
      startTransition(() => {
        router.push(`/student/applications/${payload.application.id}`);
        router.refresh();
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Application could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  if (disabled) {
    return (
      <div className="panel p-5 text-slate-300">
        <p className="font-semibold text-white">Application closed</p>
        <p className="mt-2 text-[13px] text-slate-400">{disabledReason ?? "This drive is no longer accepting applications."}</p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-[20px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400"
      >
        {buttonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <div className="panel w-full max-w-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Review Your Application</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{companyName}</h2>
                <p className="text-[13px] text-slate-400">{role}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-slate-800/60 px-3 py-1 text-[13px] text-slate-300">
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="panel-soft p-4">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-500">Resume</span>
                {resumeName ?? "Your saved default resume will be attached"}
              </div>
              <div className="panel-soft p-4">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-slate-500">Deadline</span>
                {deadlineLabel}
              </div>
            </div>

            {error ? <p className="mt-4 rounded-[18px] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-[13px] text-rose-200">{error}</p> : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[18px] border border-slate-800/60 px-5 py-3 text-[13px] font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending || submitting}
                onClick={submitApplication}
                className="rounded-[18px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {isPending || submitting ? "Submitting..." : "Confirm Application"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
