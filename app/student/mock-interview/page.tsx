import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";

const rounds = ["Intro", "Technical", "Behavioral"];

export default function MockInterviewPage() {
  return (
    <MinimalPage
      eyebrow="Interview Prep"
      title="Mock Interview"
      aside={
        <p className="text-[13px] text-slate-400">
          Use this as a prep hub, not a substitute for the actual interview process.
        </p>
      }
    >
      <SectionCard title="Interview Rounds">
        <div className="grid gap-3 md:grid-cols-3">
          {rounds.map((round, index) => (
            <div key={round} className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Round {index + 1}</p>
              <p className="mt-2 text-base font-semibold text-white">{round}</p>
              <p className="mt-2 text-[13px] text-slate-400">Practice focused responses and keep your examples concise.</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </MinimalPage>
  );
}
