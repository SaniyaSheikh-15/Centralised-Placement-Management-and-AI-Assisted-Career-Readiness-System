import Link from "next/link";
import { ApplicationTimelineItem } from "@/types/placement";
import { formatDate } from "@/lib/placement-utils";

interface ApplicationTimelineProps {
  timeline: ApplicationTimelineItem[];
}

export function ApplicationTimeline({ timeline }: ApplicationTimelineProps) {
  return (
    <section className="panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Application Timeline</p>
      <div className="mt-5 space-y-4">
        {timeline.map((item, index) => (
          <div key={item.stage} className="grid gap-4 md:grid-cols-[32px_1fr]">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                  item.status === "COMPLETED"
                    ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                    : item.status === "CURRENT"
                    ? "border-sky-400/40 bg-sky-400/15 text-sky-300"
                    : item.status === "REJECTED"
                    ? "border-rose-400/40 bg-rose-400/15 text-rose-300"
                    : "border-slate-600 bg-slate-950 text-slate-400"
                }`}
              >
                {index + 1}
              </div>
              {index < timeline.length - 1 ? <div className="min-h-10 w-px bg-slate-700" /> : null}
            </div>

        <div className="panel-soft p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-[13px] text-slate-400">{item.description}</p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    item.status === "COMPLETED"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : item.status === "CURRENT"
                      ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
                      : item.status === "REJECTED"
                      ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                      : "border-slate-500/40 bg-slate-500/10 text-slate-300"
                  }`}
                >
                  {humanizeTimelineStatus(item.status)}
                </span>
              </div>
              {item.date ? <p className="mt-3 text-[13px] text-slate-400">{formatDate(item.date)}</p> : null}
              {item.actionLabel && item.actionHref ? (
                <Link href={item.actionHref} className="mt-4 inline-flex rounded-[18px] border border-slate-800/60 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-sky-400/40 hover:bg-slate-900">
                  {item.actionLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function humanizeTimelineStatus(status: ApplicationTimelineItem["status"]) {
  return {
    COMPLETED: "Completed",
    CURRENT: "Current",
    UPCOMING: "Upcoming",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn"
  }[status];
}
