"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, ApplicationResponse } from "@/lib/application-management-client";
import type { ApplicationRecord } from "@/types/placement";

interface WithdrawApplicationButtonProps {
  applicationId: string;
  disabled?: boolean;
  onWithdraw?: (application: ApplicationRecord) => void;
}

export function WithdrawApplicationButton({ applicationId, disabled, onWithdraw }: WithdrawApplicationButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withdraw() {
    setBusy(true);
    setError(null);

    try {
      const payload = await apiRequest<ApplicationResponse>(`/api/v1/applications/${applicationId}/withdraw`, { method: "PATCH" });
      onWithdraw?.(payload.application);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not withdraw application.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={withdraw}
        disabled={disabled || busy}
        className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Withdrawing..." : "Withdraw Application"}
      </button>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
