import { MinimalPage, SectionCard } from "@/components/layout/minimal-page";
import { ApplicationTable } from "@/components/placement/application-table";
import { listApplications } from "@/lib/placement-store";

export default function ApplicationsPage() {
  const applications = listApplications();

  const summary = [
    { label: "Total Applications", value: applications.length },
    { label: "Under Review", value: applications.filter((item) => item.status === "APPLIED" || item.status === "ELIGIBILITY_VERIFIED").length },
    { label: "Interviews", value: applications.filter((item) => item.status === "ASSESSMENT" || item.status === "TECHNICAL_INTERVIEW" || item.status === "HR_INTERVIEW").length },
    { label: "Selected", value: applications.filter((item) => item.status === "SELECTED").length },
    { label: "Rejected", value: applications.filter((item) => item.status === "REJECTED").length }
  ];

  return (
    <MinimalPage
      eyebrow="My Applications"
      title="Track every application, status change, and next step in one place."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summary.map((item) => (
          <div key={item.label} className="panel-soft px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-[24px] font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <SectionCard title="Applications" subtitle="Statuses and next steps are kept in one simple table.">
        <ApplicationTable applications={applications} />
      </SectionCard>
    </MinimalPage>
  );
}
