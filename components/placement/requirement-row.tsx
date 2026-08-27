import { EligibilityRequirementResult } from "@/types/placement";
import { StatusBadge } from "@/components/placement/status-badge";

interface RequirementRowProps {
  requirement: EligibilityRequirementResult;
}

export function RequirementRow({ requirement }: RequirementRowProps) {
  return (
    <div className="grid gap-3 rounded-[22px] border border-slate-800/80 bg-slate-950/70 px-4 py-3 md:grid-cols-[1.3fr_0.8fr_1fr_auto] md:items-center">
      <div>
        <p className="font-semibold text-white">{requirement.name}</p>
        {requirement.note ? <p className="mt-1 text-sm text-slate-400">{requirement.note}</p> : null}
      </div>
      <div className="text-sm text-slate-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Required</span>
        {requirement.required}
      </div>
      <div className="text-sm text-slate-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Your Value</span>
        {requirement.actual ?? "Not Found"}
      </div>
      <div className="justify-self-start md:justify-self-end">
        <StatusBadge status={requirement.status} tone="requirement" />
      </div>
    </div>
  );
}
