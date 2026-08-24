"use client";

import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Users,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Search,
  Filter,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";

type KPI = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
};

type Student = {
  id: number;
  name: string;
  department: string;
  cgpa: string;
  drives: number;
  applications: number;
  interview: string;
  placement: string;
};

/*
 * Keep all dashboard data empty.
 * Backend/API data can be connected later.
 */

const kpis: KPI[] = [
  {
    title: "Total Students",
    value: "",
    icon: Users,
    description: "Registered students",
  },
  {
    title: "Eligible Students",
    value: "",
    icon: GraduationCap,
    description: "Currently eligible",
  },
  {
    title: "Applications",
    value: "",
    icon: BriefcaseBusiness,
    description: "Total applications",
  },
  {
    title: "Students Placed",
    value: "",
    icon: CheckCircle2,
    description: "Successfully placed",
  },
  {
    title: "Placement Rate",
    value: "",
    icon: TrendingUp,
    description: "Overall placement rate",
  },
  {
    title: "Active Drives",
    value: "",
    icon: Activity,
    description: "Currently active",
  },
];

const departmentPlacementData: unknown[] = [];
const yearPlacementData: unknown[] = [];
const companyHiringData: unknown[] = [];
const salaryDistributionData: unknown[] = [];
const ctcData: unknown[] = [];
const roleOffersData: unknown[] = [];

const monthlyHiringData: unknown[] = [];
const applicationSelectionData: unknown[] = [];
const selectionRateData: unknown[] = [];
const recruitmentTrendData: unknown[] = [];

const students: Student[] = [];

const hiringUpdates: { company: string; selected: number }[] = [];

function EmptyChart({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-[#1E3045] bg-[#0B1422]">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#101C2C]">
          <TrendingUp className="h-5 w-5 text-[#1683FF]" />
        </div>

        <p className="text-sm font-medium text-slate-300">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function KPIIcon({
  Icon,
}: {
  Icon: React.ElementType;
}) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1683FF]/10">
      <Icon className="h-5 w-5 text-[#1683FF]" />
    </div>
  );
}

export default function PlacementOfficerDashboard() {
  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#050B14] text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className="mb-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

              <div>
                <p className="mb-2 text-sm font-medium text-[#1683FF]">
                  Placement Management
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Placement Officer Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Monitor student placements, hiring activity and recruitment
                  performance.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2.5 text-sm text-slate-300 transition hover:border-[#1683FF]"
                >
                  <span>Academic Year</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  <Activity className="h-4 w-4" />
                  Dashboard
                </button>

              </div>
            </div>
          </header>

          {/* =====================================================
              KPI CARDS
          ====================================================== */}

          <section className="mb-8">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Placement Overview
              </h2>

              <p className="text-sm text-slate-500">
                Key placement performance indicators
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

              {kpis.map((kpi) => {
                const Icon = kpi.icon;

                return (
                  <div
                    key={kpi.title}
                    className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5 transition hover:border-[#1683FF]/50"
                  >
                    <div className="flex items-start justify-between">
                      <KPIIcon Icon={Icon} />
                    </div>

                    <p className="mt-5 text-sm text-slate-400">
                      {kpi.title}
                    </p>

                    <div className="mt-1 min-h-[36px] text-2xl font-bold text-white">
                      {kpi.value || "—"}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {kpi.description}
                    </p>
                  </div>
                );
              })}

            </div>
          </section>

          {/* =====================================================
              HIRING UPDATES
          ====================================================== */}

          <section className="mb-8">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Hiring Updates
              </h2>

              <p className="text-sm text-slate-500">
                Recent company selection activity
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#1E3045] bg-[#101C2C]">

              <div className="grid grid-cols-2 border-b border-[#1E3045] bg-[#0B1422] px-5 py-4">

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Company
                </span>

                <span className="text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Selected Students
                </span>

              </div>

              {hiringUpdates.length === 0 ? (
                <div className="flex min-h-[180px] items-center justify-center">

                  <div className="text-center">

                    <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-600" />

                    <p className="mt-3 text-sm text-slate-400">
                      No hiring updates available
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Company hiring data will appear here.
                    </p>

                  </div>

                </div>
              ) : (
                hiringUpdates.map((company) => (
                  <div
                    key={company.company}
                    className="grid grid-cols-2 border-b border-[#1E3045] px-5 py-4 last:border-0"
                  >
                    <span className="text-sm text-slate-200">
                      {company.company}
                    </span>

                    <span className="text-right text-sm font-semibold text-[#1683FF]">
                      {company.selected}
                    </span>
                  </div>
                ))
              )}

            </div>
          </section>

          {/* =====================================================
              PLACEMENT SCENARIO
          ====================================================== */}

          <section className="mb-8">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Placement Scenario
              </h2>

              <p className="text-sm text-slate-500">
                Analyze placement performance across departments, companies,
                years and compensation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* Placement Rate */}

              <ChartCard
                title="Placement Rate"
                description="Overall placement performance"
              >
                {departmentPlacementData.length === 0 ? (
                  <EmptyChart
                    title="No placement rate data"
                    description="Placement rate data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={departmentPlacementData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#1683FF"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Department-wise Placement */}

              <ChartCard
                title="Department-wise Placement"
                description="Placement distribution by department"
              >
                {departmentPlacementData.length === 0 ? (
                  <EmptyChart
                    title="No department data"
                    description="Department placement data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentPlacementData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />

                      <Bar
                        dataKey="placed"
                        fill="#1683FF"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Year-wise Placement */}

              <ChartCard
                title="Year-wise Placement"
                description="Placement performance across academic years"
              >
                {yearPlacementData.length === 0 ? (
                  <EmptyChart
                    title="No yearly data"
                    description="Year-wise placement data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={yearPlacementData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="placed"
                        stroke="#7C5CFF"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Company-wise Hiring */}

              <ChartCard
                title="Company-wise Hiring"
                description="Students hired by company"
              >
                {companyHiringData.length === 0 ? (
                  <EmptyChart
                    title="No company hiring data"
                    description="Company-wise hiring data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={companyHiringData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="company" />
                      <YAxis />
                      <Tooltip />

                      <Bar
                        dataKey="students"
                        fill="#7C5CFF"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Salary Distribution */}

              <ChartCard
                title="Salary Distribution"
                description="Distribution of offered salary packages"
              >
                {salaryDistributionData.length === 0 ? (
                  <EmptyChart
                    title="No salary data"
                    description="Salary distribution will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={salaryDistributionData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />

                      <Bar
                        dataKey="students"
                        fill="#22C55E"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* CTC Statistics */}

              <ChartCard
                title="CTC Statistics"
                description="Compensation statistics across offers"
              >
                {ctcData.length === 0 ? (
                  <EmptyChart
                    title="No CTC data"
                    description="CTC statistics will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={ctcData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#F59E0B"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Offers by Role */}

              <ChartCard
                title="Offers by Role"
                description="Distribution of placement offers by role"
              >
                {roleOffersData.length === 0 ? (
                  <EmptyChart
                    title="No role data"
                    description="Role-wise offer data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>

                      <Pie
                        data={roleOffersData as any[]}
                        dataKey="offers"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                      >
                        {(roleOffersData as any[]).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index % 2 === 0
                                ? "#1683FF"
                                : "#7C5CFF"
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip />

                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

            </div>
          </section>

          {/* =====================================================
              ELIGIBLE STUDENTS
          ====================================================== */}

          <section className="mb-8">

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Eligible Students
              </h2>

              <p className="text-sm text-slate-500">
                Monitor eligibility, applications, interviews and placement
                status.
              </p>
            </div>

            {/* FILTERS */}

            <div className="mb-4 rounded-xl border border-[#1E3045] bg-[#101C2C] p-4">

              <div className="mb-4 flex items-center gap-2">

                <Filter className="h-4 w-4 text-[#1683FF]" />

                <span className="text-sm font-medium text-white">
                  Filters
                </span>

              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

                <select
                  aria-label="Department filter"
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Department
                  </option>
                </select>

                <select
                  aria-label="CGPA filter"
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    CGPA
                  </option>
                </select>

                <select
                  aria-label="Company filter"
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Company
                  </option>
                </select>

                <select
                  aria-label="Branch filter"
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Branch
                  </option>
                </select>

                <select
                  aria-label="Placement status filter"
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Placement Status
                  </option>
                </select>

              </div>

              {/* SEARCH */}

              <div className="mt-3 flex items-center rounded-lg border border-[#1E3045] bg-[#0B1422] px-3">

                <Search className="h-4 w-4 text-slate-500" />

                <input
                  type="text"
                  placeholder="Search student..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
                />

              </div>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto rounded-xl border border-[#1E3045] bg-[#101C2C]">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-[#0B1422]">

                  <tr className="border-b border-[#1E3045]">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Department
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      CGPA
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Eligible Drives
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Applications
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Interview Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Placement Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.length === 0 ? (
                    <tr>

                      <td
                        colSpan={7}
                        className="px-5 py-16 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <Users className="h-9 w-9 text-slate-600" />

                          <p className="mt-3 text-sm text-slate-400">
                            No student data available
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            Student records will appear after backend
                            integration.
                          </p>

                        </div>

                      </td>

                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-[#1E3045] transition hover:bg-[#0B1422]"
                      >

                        <td className="px-5 py-4 text-sm text-white">
                          {student.name}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {student.department}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {student.cgpa}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {student.drives}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {student.applications}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {student.interview}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {student.placement}
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>
          </section>

          {/* =====================================================
              HIRING TRENDS
          ====================================================== */}

          <section className="mb-8">

            <div className="mb-4">

              <h2 className="text-lg font-semibold text-white">
                Hiring Trends
              </h2>

              <p className="text-sm text-slate-500">
                Analyze recruitment activity and selection performance.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* Monthly Hiring */}

              <ChartCard
                title="Monthly Hiring"
                description="Monthly student hiring trend"
              >
                {monthlyHiringData.length === 0 ? (
                  <EmptyChart
                    title="No monthly hiring data"
                    description="Monthly hiring trends will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyHiringData as any[]}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="hired"
                        stroke="#1683FF"
                        strokeWidth={3}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Applications vs Selections */}

              <ChartCard
                title="Applications vs Selections"
                description="Compare applications and successful selections"
              >
                {applicationSelectionData.length === 0 ? (
                  <EmptyChart
                    title="No application data"
                    description="Application and selection data will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={applicationSelectionData as any[]}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="applications"
                        fill="#1683FF"
                      />

                      <Bar
                        dataKey="selections"
                        fill="#7C5CFF"
                      />

                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Selection Rate */}

              <ChartCard
                title="Selection Rate"
                description="Selection percentage over time"
              >
                {selectionRateData.length === 0 ? (
                  <EmptyChart
                    title="No selection rate data"
                    description="Selection rate trends will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={selectionRateData as any[]}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#22C55E"
                        strokeWidth={3}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              {/* Company Recruitment Trends */}

              <ChartCard
                title="Company Recruitment Trends"
                description="Company recruitment activity over time"
              >
                {recruitmentTrendData.length === 0 ? (
                  <EmptyChart
                    title="No recruitment data"
                    description="Company recruitment trends will appear here."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={recruitmentTrendData as any[]}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="recruitments"
                        stroke="#7C5CFF"
                        strokeWidth={3}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

            </div>
          </section>

          {/* =====================================================
              PLACEMENT INSIGHTS
          ====================================================== */}

          <section className="pb-8">

            <div className="mb-4">

              <h2 className="text-lg font-semibold text-white">
                Placement Insights
              </h2>

              <p className="text-sm text-slate-500">
                AI-assisted insights generated from placement data.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* Placement Performance */}

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1683FF]/10">
                  <TrendingUp className="h-5 w-5 text-[#1683FF]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Placement Performance
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Placement insights will be generated when historical
                  placement data becomes available.
                </p>

              </div>

              {/* Attention Required */}

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Attention Required
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Student application gaps and inactive eligible students
                  will be highlighted here.
                </p>

              </div>

              {/* Recommendation */}

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">
                  <Lightbulb className="h-5 w-5 text-[#7C5CFF]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  AI-based recommendations will appear here after placement
                  analytics are connected.
                </p>

              </div>

            </div>
          </section>

        </div>
      </main>
    </DashboardLayout>
  );
}