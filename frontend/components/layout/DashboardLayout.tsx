"use client";

import {
  Activity,
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Filter,
  GraduationCap,
  Lightbulb,
  Search,
  TrendingUp,
  Users,
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

import { useMemo, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import type {AppUser} from "@/components/layout/DashboardLayout";

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
  branch?: string;
  cgpa: string;
  drives: number;
  applications: number;
  interview: string;
  placement: string;
  company?: string;
};

type PlacementOfficerDashboardData = {
  kpis: KPI[];
  departmentPlacementData: Array<{
    department: string;
    placed: number;
    rate?: number;
  }>;
  yearPlacementData: Array<{
    year: string;
    placed: number;
  }>;
  companyHiringData: Array<{
    company: string;
    students: number;
  }>;
  salaryDistributionData: Array<{
    range: string;
    students: number;
  }>;
  ctcData: Array<{
    range: string;
    value: number;
  }>;
  roleOffersData: Array<{
    role: string;
    offers: number;
  }>;
  monthlyHiringData: Array<{
    month: string;
    hired: number;
  }>;
  applicationSelectionData: Array<{
    month: string;
    applications: number;
    selections: number;
  }>;
  selectionRateData: Array<{
    month: string;
    rate: number;
  }>;
  recruitmentTrendData: Array<{
    month: string;
    recruitments: number;
  }>;
  students: Student[];
  hiringUpdates: Array<{
    company: string;
    selected: number;
  }>;
};

type Filters = {
  department: string;
  cgpa: string;
  company: string;
  branch: string;
  placement: string;
  search: string;
};

const EMPTY_DASHBOARD_DATA: PlacementOfficerDashboardData = {
  kpis: [
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
  ],

  departmentPlacementData: [],
  yearPlacementData: [],
  companyHiringData: [],
  salaryDistributionData: [],
  ctcData: [],
  roleOffersData: [],
  monthlyHiringData: [],
  applicationSelectionData: [],
  selectionRateData: [],
  recruitmentTrendData: [],
  students: [],
  hiringUpdates: [],
};

function formatRole(role: AppUser["role"]) {
  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

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
  /*
   * TEMPORARY authenticated-user object.
   *
   * This is intentionally isolated in one place.
   *
   * Later replace this with:
   *
   * const user = currentUserFromAuth;
   *
   * from your JWT/current-user authentication flow.
   */
  const user: AppUser = {
    name: "Admin Name",
    role: "placement_officer",
  };

  /*
   * API-ready dashboard state.
   *
   * Later your API response can populate this state.
   *
   * Example:
   *
   * const response = await fetch("/api/placement-officer/dashboard");
   * const data = await response.json();
   * setDashboardData(data);
   */
  const [dashboardData, setDashboardData] =
    useState<PlacementOfficerDashboardData>(
      EMPTY_DASHBOARD_DATA
    );

  /*
   * Academic year is kept as component state so it can
   * later be passed to the backend API.
   */
  const [academicYear, setAcademicYear] =
    useState("Current Academic Year");

  /*
   * Functional frontend filters.
   *
   * These currently filter dashboardData.students.
   * When backend APIs are connected, the same state can
   * be used to send query parameters to the API.
   */
  const [filters, setFilters] = useState<Filters>({
    department: "",
    cgpa: "",
    company: "",
    branch: "",
    placement: "",
    search: "",
  });

  const filteredStudents = useMemo(() => {
    return dashboardData.students.filter(
      (student) => {
        const search =
          filters.search.toLowerCase().trim();

        const matchesSearch =
          !search ||
          student.name
            .toLowerCase()
            .includes(search) ||
          student.department
            .toLowerCase()
            .includes(search) ||
          student.company
            ?.toLowerCase()
            .includes(search);

        const matchesDepartment =
          !filters.department ||
          student.department ===
            filters.department;

        const matchesCompany =
          !filters.company ||
          student.company === filters.company;

        const matchesBranch =
          !filters.branch ||
          student.branch === filters.branch;

        const matchesPlacement =
          !filters.placement ||
          student.placement === filters.placement;

        const matchesCgpa =
          !filters.cgpa ||
          Number(student.cgpa) >=
            Number(filters.cgpa);

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesCompany &&
          matchesBranch &&
          matchesPlacement &&
          matchesCgpa
        );
      }
    );
  }, [dashboardData.students, filters]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          dashboardData.students
            .map((student) => student.department)
            .filter(Boolean)
        )
      ),
    [dashboardData.students]
  );

  const companies = useMemo(
    () =>
      Array.from(
        new Set(
          dashboardData.students
            .map((student) => student.company)
            .filter(Boolean)
        )
      ),
    [dashboardData.students]
  );

  const branches = useMemo(
    () =>
      Array.from(
        new Set(
          dashboardData.students
            .map((student) => student.branch)
            .filter(Boolean)
        )
      ),
    [dashboardData.students]
  );

  const resetFilters = () => {
    setFilters({
      department: "",
      cgpa: "",
      company: "",
      branch: "",
      placement: "",
      search: "",
    });
  };

  const handleLogout = () => {
    /*
     * Authentication/logout integration will be connected
     * here when JWT authentication is ready.
     */
    console.log("Logout requested");
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
    >
      <main className="min-h-screen bg-[#050B14] text-white">
        <div className="mx-auto max-w-[1600px]">

          {/* HEADER */}
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
                  Monitor student placements, hiring
                  activity and recruitment performance.
                </p>

                {/* Dynamic authenticated user */}
                <p className="mt-2 text-xs text-slate-600">
                  Signed in as{" "}
                  <span className="text-slate-400">
                    {user.name}
                  </span>{" "}
                  ·{" "}
                  <span className="text-slate-400">
                    {formatRole(user.role)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={academicYear}
                  onChange={(event) =>
                    setAcademicYear(event.target.value)
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-[#1683FF]"
                >
                  <option>
                    Current Academic Year
                  </option>
                  <option>2026-27</option>
                  <option>2025-26</option>
                  <option>2024-25</option>
                </select>

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

          {/* KPI CARDS */}
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
              {dashboardData.kpis.map((kpi) => {
                const Icon = kpi.icon;

                return (
                  <div
                    key={kpi.title}
                    className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5 transition hover:border-[#1683FF]/50"
                  >
                    <KPIIcon Icon={Icon} />

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

          {/* HIRING UPDATES */}
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

              {dashboardData.hiringUpdates.length ===
              0 ? (
                <div className="flex min-h-[180px] items-center justify-center">
                  <div className="text-center">
                    <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-600" />

                    <p className="mt-3 text-sm text-slate-400">
                      No hiring updates available
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Company hiring data will appear
                      here after API integration.
                    </p>
                  </div>
                </div>
              ) : (
                dashboardData.hiringUpdates.map(
                  (company) => (
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
                  )
                )
              )}
            </div>
          </section>

          {/* PLACEMENT SCENARIO */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Placement Scenario
              </h2>

              <p className="text-sm text-slate-500">
                Analyze placement performance across
                departments, companies, years and
                compensation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {/* Placement Rate */}
              <ChartCard
                title="Placement Rate"
                description="Overall placement performance"
              >
                {dashboardData.departmentPlacementData
                  .length === 0 ? (
                  <EmptyChart
                    title="No placement rate data"
                    description="Placement rate data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={
                        dashboardData.departmentPlacementData
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
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

              {/* Department */}
              <ChartCard
                title="Department-wise Placement"
                description="Placement distribution by department"
              >
                {dashboardData.departmentPlacementData
                  .length === 0 ? (
                  <EmptyChart
                    title="No department data"
                    description="Department placement data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        dashboardData.departmentPlacementData
                      }
                    >
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

              {/* Year */}
              <ChartCard
                title="Year-wise Placement"
                description="Placement performance across academic years"
              >
                {dashboardData.yearPlacementData
                  .length === 0 ? (
                  <EmptyChart
                    title="No yearly data"
                    description="Year-wise placement data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={
                        dashboardData.yearPlacementData
                      }
                    >
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

              {/* Company */}
              <ChartCard
                title="Company-wise Hiring"
                description="Students hired by company"
              >
                {dashboardData.companyHiringData
                  .length === 0 ? (
                  <EmptyChart
                    title="No company hiring data"
                    description="Company hiring data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        dashboardData.companyHiringData
                      }
                    >
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

              {/* Salary */}
              <ChartCard
                title="Salary Distribution"
                description="Distribution of offered salary packages"
              >
                {dashboardData.salaryDistributionData
                  .length === 0 ? (
                  <EmptyChart
                    title="No salary data"
                    description="Salary distribution will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        dashboardData.salaryDistributionData
                      }
                    >
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

              {/* CTC */}
              <ChartCard
                title="CTC Statistics"
                description="Compensation statistics across offers"
              >
                {dashboardData.ctcData.length === 0 ? (
                  <EmptyChart
                    title="No CTC data"
                    description="CTC statistics will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={dashboardData.ctcData}
                    >
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

              {/* Roles */}
              <ChartCard
                title="Offers by Role"
                description="Distribution of placement offers by role"
              >
                {dashboardData.roleOffersData
                  .length === 0 ? (
                  <EmptyChart
                    title="No role data"
                    description="Role-wise offer data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <PieChart>
                      <Pie
                        data={
                          dashboardData.roleOffersData
                        }
                        dataKey="offers"
                        nameKey="role"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                      >
                        {dashboardData.roleOffersData.map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index % 2 === 0
                                  ? "#1683FF"
                                  : "#7C5CFF"
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>
          </section>

          {/* ELIGIBLE STUDENTS */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Eligible Students
              </h2>

              <p className="text-sm text-slate-500">
                Monitor eligibility, applications,
                interviews and placement status.
              </p>
            </div>

            {/* FILTERS */}
            <div className="mb-4 rounded-xl border border-[#1E3045] bg-[#101C2C] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#1683FF]" />

                  <span className="text-sm font-medium text-white">
                    Filters
                  </span>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#1683FF] hover:underline"
                >
                  Clear Filters
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
                {/* Department */}
                <select
                  value={filters.department}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      department:
                        event.target.value,
                    }))
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  ))}
                </select>

                {/* CGPA */}
                <select
                  value={filters.cgpa}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      cgpa: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Minimum CGPA
                  </option>

                  <option value="6">
                    6.0+
                  </option>

                  <option value="7">
                    7.0+
                  </option>

                  <option value="8">
                    8.0+
                  </option>

                  <option value="9">
                    9.0+
                  </option>
                </select>

                {/* Company */}
                <select
                  value={filters.company}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      company: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Company
                  </option>

                  {companies.map((company) => (
                    <option
                      key={company}
                      value={company}
                    >
                      {company}
                    </option>
                  ))}
                </select>

                {/* Branch */}
                <select
                  value={filters.branch}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      branch: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Branch
                  </option>

                  {branches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </option>
                  ))}
                </select>

                {/* Placement */}
                <select
                  value={filters.placement}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      placement:
                        event.target.value,
                    }))
                  }
                  className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Placement Status
                  </option>

                  <option value="Placed">
                    Placed
                  </option>

                  <option value="Not Placed">
                    Not Placed
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>
                </select>
              </div>

              {/* Search */}
              <div className="mt-3 flex items-center rounded-lg border border-[#1E3045] bg-[#0B1422] px-3">
                <Search className="h-4 w-4 text-slate-500" />

                <input
                  type="search"
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      search: event.target.value,
                    }))
                  }
                  placeholder="Search student, department or company..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* RESPONSIVE TABLE */}
            <div className="w-full overflow-x-auto rounded-xl border border-[#1E3045] bg-[#101C2C]">
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
                  {filteredStudents.length === 0 ? (
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
                            Student records will appear
                            after backend integration.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(
                      (student) => (
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
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Showing {filteredStudents.length} of{" "}
              {dashboardData.students.length} students
            </p>
          </section>

          {/* HIRING TRENDS */}
          <section className="mb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Hiring Trends
              </h2>

              <p className="text-sm text-slate-500">
                Analyze recruitment activity and
                selection performance.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              <ChartCard
                title="Monthly Hiring"
                description="Monthly student hiring trend"
              >
                {dashboardData.monthlyHiringData
                  .length === 0 ? (
                  <EmptyChart
                    title="No monthly hiring data"
                    description="Monthly hiring trends will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={
                        dashboardData.monthlyHiringData
                      }
                    >
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

              <ChartCard
                title="Applications vs Selections"
                description="Compare applications and successful selections"
              >
                {dashboardData.applicationSelectionData
                  .length === 0 ? (
                  <EmptyChart
                    title="No application data"
                    description="Application and selection data will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        dashboardData.applicationSelectionData
                      }
                    >
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

              <ChartCard
                title="Selection Rate"
                description="Selection percentage over time"
              >
                {dashboardData.selectionRateData
                  .length === 0 ? (
                  <EmptyChart
                    title="No selection rate data"
                    description="Selection rate trends will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={
                        dashboardData.selectionRateData
                      }
                    >
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

              <ChartCard
                title="Company Recruitment Trends"
                description="Company recruitment activity over time"
              >
                {dashboardData.recruitmentTrendData
                  .length === 0 ? (
                  <EmptyChart
                    title="No recruitment data"
                    description="Company recruitment trends will appear here after API integration."
                  />
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <LineChart
                      data={
                        dashboardData.recruitmentTrendData
                      }
                    >
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

          {/* PLACEMENT INSIGHTS */}
          <section className="pb-8">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Placement Insights
              </h2>

              <p className="text-sm text-slate-500">
                AI-assisted insights generated from
                placement data.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1683FF]/10">
                  <TrendingUp className="h-5 w-5 text-[#1683FF]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Placement Performance
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Placement insights will be generated
                  when historical placement data becomes
                  available.
                </p>
              </div>

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Attention Required
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Student application gaps and inactive
                  eligible students will be highlighted
                  here.
                </p>
              </div>

              <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">
                  <Lightbulb className="h-5 w-5 text-[#7C5CFF]" />
                </div>

                <p className="mt-5 text-sm font-medium text-slate-300">
                  Recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  AI-based recommendations will appear
                  here after placement analytics are
                  connected.
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}