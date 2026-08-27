import Link from "next/link";
import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";

const strengths = ["Clear formatting", "Good academic coverage", "Relevant project mention"];
const improvements = ["Add more quantified outcomes", "Surface role-specific skills earlier", "Show tools and impact in project bullets"];

export default function ResumeAnalyzerPage() {
  return (
    <MinimalPage
      eyebrow="AI Career Intelligence"
      title="Resume Analyzer"
      aside={
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300/80">Resume Status</p>
            <p className="mt-1 text-base font-semibold text-white">Good standing</p>
            <p className="mt-1 text-[13px] text-slate-400">Last analyzed 2 days ago</p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/10 text-2xl font-bold text-sky-300">
            78
          </div>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard title="Upload Resume" subtitle="Drop a PDF to update your latest resume snapshot.">
          <div className="rounded-[18px] border border-dashed border-slate-700/80 bg-slate-950/45 p-8 text-center">
            <p className="text-sm font-medium text-white">Drop your resume here</p>
            <p className="mt-2 text-[13px] text-slate-400">PDF only · Maximum file size 10 MB</p>
            <button className="mt-4 rounded-[18px] bg-sky-500 px-4 py-2.5 text-[13px] font-semibold text-white">Browse PDF</button>
          </div>
        </SectionCard>

        <SectionCard title="ATS Score" subtitle="A concise summary with the next best actions.">
          <div className="grid gap-3">
            <Metric label="ATS Score" value="78 / 100" />
            <Metric label="Status" value="Good standing" />
            <div className="pt-2 text-[13px] text-slate-400">
              <Link href="/student/placement-match" className="text-sky-300 hover:text-sky-200">
                Match against a job description →
              </Link>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <SectionCard title="Strengths">
          <ul className="space-y-2">
            {strengths.map((item) => (
              <li key={item} className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-[13px] text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Quick Improvements">
          <ul className="space-y-2">
            {improvements.map((item) => (
              <li key={item} className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 px-4 py-3 text-[13px] text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </MinimalPage>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-800/60 bg-slate-950/45 p-4">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-[15px] font-semibold text-white">{value}</p>
    </div>
  );
}
