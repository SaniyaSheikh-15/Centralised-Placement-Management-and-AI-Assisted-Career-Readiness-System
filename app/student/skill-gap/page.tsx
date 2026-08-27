import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";

const gaps = [
  { skill: "Docker", level: "Basic missing", action: "Add to 1 project" },
  { skill: "System Design", level: "Needs practice", action: "Revise fundamentals" },
  { skill: "Testing", level: "Light coverage", action: "Add unit tests" }
];

export default function SkillGapPage() {
  return (
    <MinimalPage
      eyebrow="Skill Gap"
      title="Skill Gap"
      aside={
        <p className="text-[13px] text-slate-400">
          Focus on the smallest set of missing skills that unlocks more eligible drives.
        </p>
      }
    >
      <SectionCard title="Gap Summary" subtitle="One row per improvement area.">
        <div className="grid gap-3 md:grid-cols-3">
          {gaps.map((gap) => (
            <div key={gap.skill} className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 p-4">
              <p className="text-base font-semibold text-white">{gap.skill}</p>
              <p className="mt-1 text-[13px] text-slate-400">{gap.level}</p>
              <p className="mt-3 text-[13px] text-sky-300">{gap.action}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </MinimalPage>
  );
}
