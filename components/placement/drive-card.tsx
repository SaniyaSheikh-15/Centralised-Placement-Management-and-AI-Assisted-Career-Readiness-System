import Link from "next/link";
import { PlacementDrive } from "@/types/placement";
import { DeadlineBadge } from "@/components/placement/deadline-badge";
import { StatusBadge } from "@/components/placement/status-badge";
import { humanizeJobType, humanizeWorkMode } from "@/lib/placement-utils";

interface DriveCardProps {
  drive: PlacementDrive;
  eligibilityLabel: string;
  actionHref: string;
  actionLabel: string;
  actionDisabled?: boolean;
}

export function DriveCard({ drive, eligibilityLabel, actionHref, actionLabel, actionDisabled }: DriveCardProps) {
  return (
    <article className="group rounded-[28px] border border-slate-800/80 bg-[#0b1524]/92 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.24)] backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/35">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950 text-lg font-bold text-white">
            {drive.companyLogo ?? drive.companyName.slice(0, 1)}
          </div>
          <div>
            <p className="text-[13px] text-slate-400">{drive.companyIndustry}</p>
            <h3 className="text-lg font-semibold text-white">{drive.companyName}</h3>
            <p className="text-[13px] text-slate-300">{drive.title}</p>
          </div>
        </div>
        <StatusBadge status={drive.status} tone="drive" />
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/70 px-3 py-2">
          <p className="text-[13px] text-slate-500">CTC</p>
          <p className="font-semibold text-white">{drive.ctc}</p>
        </div>
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/70 px-3 py-2">
          <p className="text-[13px] text-slate-500">Location</p>
          <p className="font-semibold text-white">{drive.location}</p>
        </div>
        <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/70 px-3 py-2">
          <p className="text-[13px] text-slate-500">Job Type</p>
          <p className="font-semibold text-white">
            {humanizeJobType(drive.jobType)} · {humanizeWorkMode(drive.workMode)}
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-[13px] leading-6 text-slate-400">{drive.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {drive.requiredSkills.slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-200">
            {skill}
          </span>
        ))}
        {drive.requiredSkills.length > 4 ? (
          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-400">
            +{drive.requiredSkills.length - 4}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <DeadlineBadge deadline={drive.applicationDeadline} />
        <p className="text-[11px] font-medium text-slate-400">{eligibilityLabel}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/student/placement-drives/${drive.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-[20px] border border-slate-800/80 bg-slate-950 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:border-sky-400/40 hover:bg-slate-900"
        >
          View Details
        </Link>
        {actionDisabled ? (
          <button
            type="button"
            disabled
            className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded-[20px] bg-slate-700 px-4 py-2.5 text-[13px] font-semibold text-slate-300"
          >
            {actionLabel}
          </button>
        ) : (
          <Link href={actionHref} className="inline-flex flex-1 items-center justify-center rounded-[20px] bg-sky-500 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-sky-400">
            {actionLabel}
          </Link>
        )}
      </div>
    </article>
  );
}
