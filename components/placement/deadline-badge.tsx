import { isClosingSoon, isDeadlineClosed, formatDate } from "@/lib/placement-utils";

interface DeadlineBadgeProps {
  deadline: string;
}

export function DeadlineBadge({ deadline }: DeadlineBadgeProps) {
  if (isDeadlineClosed(deadline)) {
    return <span className="inline-flex rounded-full border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">Applications Closed</span>;
  }

  if (isClosingSoon(deadline)) {
    return (
      <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
        Closes Soon · {formatDate(deadline)}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
      Closes on {formatDate(deadline)}
    </span>
  );
}
