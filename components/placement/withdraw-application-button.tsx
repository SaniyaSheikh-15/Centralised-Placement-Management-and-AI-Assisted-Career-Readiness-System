"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WithdrawApplicationButtonProps {
  applicationId: string;
  disabled?: boolean;
}

export function WithdrawApplicationButton({ applicationId, disabled }: WithdrawApplicationButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function withdraw() {
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/v1/applications/${applicationId}/withdraw`, {
      method: "PATCH"
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload?.message ?? "Could not withdraw application.");
      setBusy(false);
      return;
    }

    router.refresh();
    setBusy(false);
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
