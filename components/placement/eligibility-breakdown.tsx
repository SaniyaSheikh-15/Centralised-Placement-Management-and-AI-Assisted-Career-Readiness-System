import type { CSSProperties } from "react";
import { EligibilityResult } from "@/types/placement";
import { RequirementRow } from "@/components/placement/requirement-row";
import { StatusBadge } from "@/components/placement/status-badge";
import { humanizeEligibilityStatus } from "@/lib/placement-utils";

interface EligibilityBreakdownProps {
  result: EligibilityResult;
}

export function EligibilityBreakdown({ result }: EligibilityBreakdownProps) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Eligibility Status</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{humanizeEligibilityStatus(result.status)}</h2>
        </div>
        <StatusBadge status={result.status} tone="eligibility" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="panel-soft p-5 text-center">
          <div
            className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-slate-700 bg-[conic-gradient(#1683FF_0deg,#1683FF_calc(var(--score)*3.6deg),rgba(15,23,42,0.5)_0deg)]"
            style={{ ["--score" as never]: `${result.score}` } as CSSProperties}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-slate-800/60 bg-slate-950">
              <div>
                <div className="text-2xl font-bold text-white">{result.score}%</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Eligibility Score</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{result.summary}</p>
        </div>

        <div className="space-y-3">
          {result.requirements.map((requirement) => (
            <RequirementRow key={requirement.name} requirement={requirement} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="panel-soft p-4">
          <p className="text-[13px] font-semibold text-white">Missing Requirements</p>
          {result.missingRequirements.length ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {result.missingRequirements.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No missing mandatory requirements were detected.</p>
          )}
        </div>

        <div className="panel-soft p-4">
          <p className="text-[13px] font-semibold text-white">How to Improve</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {result.guidance.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
