import { notFound } from "next/navigation";
import Link from "next/link";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { EligibilityBreakdown } from "@/components/placement/eligibility-breakdown";
import { StatusBadge } from "@/components/placement/status-badge";
import { getEligibility, listDrives } from "@/lib/placement-store";
import { humanizeEligibilityStatus } from "@/lib/placement-utils";

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function EligibilityPage({ searchParams = {} }: PageProps) {
  const params = searchParams;
  const driveId = typeof params.driveId === "string" ? params.driveId : listDrives()[0]?.id;
  const drive = listDrives().find((item) => item.id === driveId);
  if (!drive) {
    notFound();
  }

  const result = getEligibility(drive.id);
  if (!result) {
    notFound();
  }

  const otherDrives = listDrives()
    .filter((item) => item.id !== drive.id)
    .map((item) => ({ drive: item, eligibility: getEligibility(item.id) }))
    .filter((item) => item.eligibility);

  return (
    <MinimalPage
      eyebrow="Eligibility Engine"
      title="Understand why a drive is eligible, partial, or blocked."
      aside={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[13px] text-slate-400">Selected drive</span>
          <StatusBadge status={result.status} tone="eligibility" />
          <span className="text-[13px] text-slate-300">
            {drive.companyName} · {drive.title}
          </span>
        </div>
      }
    >
      <EligibilityBreakdown result={result} />

      <SectionCard title="Other Drive Snapshots" subtitle="Check other drive outcomes without leaving the page.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {otherDrives.map((item) => (
            <Link key={item.drive.id} href={`/student/eligibility?driveId=${item.drive.id}`} className="panel-soft p-4 transition hover:border-sky-400/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-white">{item.drive.companyName}</h4>
                  <p className="text-[13px] text-slate-400">{item.drive.title}</p>
                </div>
                <StatusBadge status={item.eligibility!.status} tone="eligibility" />
              </div>
              <p className="mt-3 text-[13px] text-slate-400">{item.eligibility!.summary}</p>
              <p className="mt-3 text-[13px] text-slate-300">
                {item.eligibility!.score}% {humanizeEligibilityStatus(item.eligibility!.status)}
              </p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </MinimalPage>
  );
}
