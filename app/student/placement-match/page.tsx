import Link from "next/link";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";

const matches = [
  { role: "Software Engineer", score: 92, note: "Strong skill overlap and profile alignment." },
  { role: "Data Analyst", score: 84, note: "Strong SQL and analytics fit." },
  { role: "ML Engineer", score: 88, note: "Strong Python and ML foundation." }
];

export default function PlacementMatchPage() {
  return (
    <MinimalPage
      eyebrow="AI Placement Match"
      title="Placement Match"
      aside={
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-violet-300/80">Placement Match</p>
            <p className="mt-1 text-base font-semibold text-white">92% top match</p>
            <p className="mt-1 text-[13px] text-slate-400">Best viewed as guidance, not authorization.</p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-2xl font-bold text-violet-300">
            92
          </div>
        </div>
      }
    >
      <SectionCard title="Top Matches" subtitle="Cleaner, ranked fit signals for open roles.">
        <div className="grid gap-3 md:grid-cols-3">
          {matches.map((match) => (
            <div key={match.role} className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">{match.role}</p>
                  <p className="mt-1 text-[13px] text-slate-400">{match.note}</p>
                </div>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                  {match.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="What this means">
          <p className="text-[13px] leading-6 text-slate-400">
            Placement match shows how strongly your profile aligns with a role. It is separate from eligibility, which decides whether you can apply.
          </p>
        </SectionCard>
        <SectionCard title="Next Step">
          <Link href="/student/placement-drives" className="inline-flex rounded-[18px] bg-sky-500 px-4 py-2.5 text-[13px] font-semibold text-white">
            Explore matching drives
          </Link>
        </SectionCard>
      </div>
    </MinimalPage>
  );
}
