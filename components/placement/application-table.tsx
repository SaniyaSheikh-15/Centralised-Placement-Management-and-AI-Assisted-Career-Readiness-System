import Link from "next/link";
import { ApplicationRecord } from "@/types/placement";
import { ApplicationStatusBadge } from "@/components/placement/application-status-badge";
import { formatDate } from "@/lib/placement-utils";

interface ApplicationTableProps {
  applications: ApplicationRecord[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  if (!applications.length) {
    return (
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-8 text-center text-slate-300">
        <p className="text-base font-semibold text-white">You have not applied to any drives yet.</p>
        <p className="mt-2 text-[13px] text-slate-400">Explore available opportunities and start your placement journey.</p>
        <Link href="/student/placement-drives" className="mt-5 inline-flex rounded-[20px] bg-sky-500 px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400">
          Explore Drives
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="hidden overflow-hidden rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 md:block">
        <table className="w-full text-left">
          <thead className="bg-slate-950/70 text-[10px] uppercase tracking-[0.35em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Company</th>
              <th className="px-5 py-4 font-semibold">Role</th>
              <th className="px-5 py-4 font-semibold">Applied</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Next Step</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-t border-slate-800">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950 text-sm font-bold text-white">
                      {application.companyLogo ?? application.companyName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{application.companyName}</div>
                      <div className="text-[11px] text-slate-400">{application.applicationId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-slate-300">{application.role}</td>
                <td className="px-5 py-4 text-[13px] text-slate-300">{formatDate(application.appliedAt)}</td>
                <td className="px-5 py-4">
                  <ApplicationStatusBadge status={application.status} />
                </td>
                <td className="px-5 py-4 text-[13px] text-slate-300">{application.nextStep ?? "—"}</td>
                <td className="px-5 py-4">
                  <Link href={`/student/applications/${application.id}`} className="rounded-[20px] border border-slate-800/80 px-4 py-2 text-[13px] font-semibold text-white transition hover:border-sky-400/40 hover:bg-slate-950">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {applications.map((application) => (
          <article key={application.id} className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white">{application.companyName}</h3>
                <p className="text-[13px] text-slate-400">{application.role}</p>
              </div>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/70 p-3 text-[13px]">Applied: {formatDate(application.appliedAt)}</div>
              <div className="rounded-[20px] border border-slate-800/80 bg-slate-950/70 p-3 text-[13px]">Next Step: {application.nextStep ?? "—"}</div>
            </div>
            <Link href={`/student/applications/${application.id}`} className="mt-4 inline-flex w-full items-center justify-center rounded-[20px] bg-sky-500 px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-sky-400">
              View
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
