import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { studentProfile } from "@/data/mock-placement-data";

export default function ProfilePage() {
  return (
    <MinimalPage
      eyebrow="Student Profile"
      title="Profile Overview"
      aside={
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-base font-bold text-white">
            {studentProfile.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{studentProfile.name}</p>
            <p className="text-[13px] text-slate-400">{studentProfile.degree} · {studentProfile.branch}</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Academic Information" subtitle="Core profile details used by placement eligibility rules.">
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="Degree" value={studentProfile.degree} />
            <Info label="Branch" value={studentProfile.branch} />
            <Info label="Year" value={studentProfile.year} />
            <Info label="CGPA" value={studentProfile.cgpa.toFixed(2)} />
            <Info label="Backlogs" value={String(studentProfile.backlogs)} />
            <Info label="Resume" value={studentProfile.resumeName ?? "Not uploaded"} />
          </div>
        </SectionCard>

        <SectionCard title="Profile Summary" subtitle="Compact at-a-glance snapshot.">
          <div className="grid gap-3">
            <Info label="Skills" value={studentProfile.skills.join(", ")} />
            <Info label="Certifications" value={studentProfile.certifications.join(", ")} />
          </div>
        </SectionCard>
      </div>
    </MinimalPage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-800/60 bg-slate-950/55 p-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-[13px] leading-6 text-white">{value}</p>
    </div>
  );
}
