"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
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

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";
import type { AppUser } from "@/components/layout/AppLayout";
import type { UserRole } from "@/navigation/sidebarConfig";

import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import InsightCard from "@/components/dashboard/InsightCard";

/* =========================================================
   TYPES
========================================================= */

type KPI = {
  title: string;
  value: string;
  icon: typeof Users;
  description: string;
};

type DepartmentPlacement = {
  department: string;
  placed: number;
  eligible: number;
  rate: number;
};

type YearPlacement = {
  year: string;
  placed: number;
  eligible: number;
};

type CompanyHiring = {
  company: string;
  students: number;
};

type SalaryDistribution = {
  range: string;
  students: number;
};

type CTCData = {
  range: string;
  value: number;
};

type RoleOffer = {
  role: string;
  offers: number;
};

type MonthlyHiring = {
  month: string;
  hired: number;
};

type ApplicationSelection = {
  month: string;
  applications: number;
  selections: number;
};

type SelectionRate = {
  month: string;
  rate: number;
};

type RecruitmentTrend = {
  month: string;
  recruitments: number;
};

type Student = {
  id: number | string;
  name: string;
  department: string;
  branch: string;
  cgpa: string;
  company?: string;
  drives: number;
  applications: number;
  interview: string;
  placement: string;
};

type HiringUpdate = {
  company: string;
  selected: number;
};

/* =========================================================
   DUMMY DATA
   ---------------------------------------------------------
   Development only.
   These arrays can later be replaced by API responses.
========================================================= */

const dummyKpis: KPI[] = [
  {
    title: "Total Students",
    value: "1248",
    icon: Users,
    description: "Registered students",
  },
  {
    title: "Eligible Students",
    value: "986",
    icon: GraduationCap,
    description: "Currently eligible",
  },
  {
    title: "Applications",
    value: "3245",
    icon: BriefcaseBusiness,
    description: "Total applications",
  },
  {
    title: "Students Placed",
    value: "742",
    icon: CheckCircle2,
    description: "Successfully placed",
  },
  {
    title: "Placement Rate",
    value: "75.25%",
    icon: TrendingUp,
    description: "Overall placement rate",
  },
  {
    title: "Active Drives",
    value: "18",
    icon: Activity,
    description: "Currently active",
  },
];

const dummyDepartmentPlacementData: DepartmentPlacement[] = [
  {
    department: "CSE",
    placed: 210,
    eligible: 260,
    rate: 80.77,
  },
  {
    department: "IT",
    placed: 165,
    eligible: 205,
    rate: 80.49,
  },
  {
    department: "ECE",
    placed: 132,
    eligible: 190,
    rate: 69.47,
  },
  {
    department: "EEE",
    placed: 98,
    eligible: 145,
    rate: 67.59,
  },
  {
    department: "ME",
    placed: 72,
    eligible: 110,
    rate: 65.45,
  },
];

const dummyYearPlacementData: YearPlacement[] = [
  {
    year: "2022-23",
    placed: 510,
    eligible: 780,
  },
  {
    year: "2023-24",
    placed: 585,
    eligible: 820,
  },
  {
    year: "2024-25",
    placed: 650,
    eligible: 890,
  },
  {
    year: "2025-26",
    placed: 742,
    eligible: 986,
  },
];

const dummyCompanyHiringData: CompanyHiring[] = [
  {
    company: "TCS",
    students: 96,
  },
  {
    company: "Infosys",
    students: 82,
  },
  {
    company: "Accenture",
    students: 76,
  },
  {
    company: "Wipro",
    students: 65,
  },
  {
    company: "Deloitte",
    students: 54,
  },
];

const dummySalaryDistributionData: SalaryDistribution[] = [
  {
    range: "3-5 LPA",
    students: 245,
  },
  {
    range: "5-8 LPA",
    students: 210,
  },
  {
    range: "8-12 LPA",
    students: 160,
  },
  {
    range: "12-20 LPA",
    students: 90,
  },
  {
    range: "20+ LPA",
    students: 37,
  },
];

const dummyCtcData: CTCData[] = [
  {
    range: "Minimum",
    value: 3.2,
  },
  {
    range: "Average",
    value: 7.8,
  },
  {
    range: "Median",
    value: 6.9,
  },
  {
    range: "Maximum",
    value: 28.5,
  },
];

const dummyRoleOffersData: RoleOffer[] = [
  {
    role: "Software Engineer",
    offers: 290,
  },
  {
    role: "Data Analyst",
    offers: 120,
  },
  {
    role: "Business Analyst",
    offers: 95,
  },
  {
    role: "Developer",
    offers: 150,
  },
  {
    role: "Other",
    offers: 87,
  },
];

const dummyMonthlyHiringData: MonthlyHiring[] = [
  {
    month: "Jan",
    hired: 42,
  },
  {
    month: "Feb",
    hired: 55,
  },
  {
    month: "Mar",
    hired: 68,
  },
  {
    month: "Apr",
    hired: 61,
  },
  {
    month: "May",
    hired: 74,
  },
  {
    month: "Jun",
    hired: 88,
  },
];

const dummyApplicationSelectionData: ApplicationSelection[] = [
  {
    month: "Jan",
    applications: 410,
    selections: 42,
  },
  {
    month: "Feb",
    applications: 520,
    selections: 55,
  },
  {
    month: "Mar",
    applications: 610,
    selections: 68,
  },
  {
    month: "Apr",
    applications: 560,
    selections: 61,
  },
  {
    month: "May",
    applications: 690,
    selections: 74,
  },
  {
    month: "Jun",
    applications: 740,
    selections: 88,
  },
];

const dummySelectionRateData: SelectionRate[] = [
  {
    month: "Jan",
    rate: 10.2,
  },
  {
    month: "Feb",
    rate: 10.6,
  },
  {
    month: "Mar",
    rate: 11.1,
  },
  {
    month: "Apr",
    rate: 10.9,
  },
  {
    month: "May",
    rate: 11.8,
  },
  {
    month: "Jun",
    rate: 11.9,
  },
];

const dummyRecruitmentTrendData: RecruitmentTrend[] = [
  {
    month: "Jan",
    recruitments: 8,
  },
  {
    month: "Feb",
    recruitments: 11,
  },
  {
    month: "Mar",
    recruitments: 14,
  },
  {
    month: "Apr",
    recruitments: 12,
  },
  {
    month: "May",
    recruitments: 16,
  },
  {
    month: "Jun",
    recruitments: 19,
  },
];

const dummyStudents: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    department: "Engineering",
    branch: "CSE",
    cgpa: "9.1",
    company: "TCS",
    drives: 12,
    applications: 8,
    interview: "Completed",
    placement: "Placed",
  },
  {
    id: 2,
    name: "Ananya Patil",
    department: "Engineering",
    branch: "IT",
    cgpa: "8.7",
    company: "Infosys",
    drives: 10,
    applications: 7,
    interview: "Completed",
    placement: "Placed",
  },
  {
    id: 3,
    name: "Rahul Verma",
    department: "Engineering",
    branch: "ECE",
    cgpa: "7.8",
    company: "Accenture",
    drives: 8,
    applications: 5,
    interview: "Scheduled",
    placement: "In Progress",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    department: "Engineering",
    branch: "CSE",
    cgpa: "9.4",
    company: "Deloitte",
    drives: 13,
    applications: 9,
    interview: "Completed",
    placement: "Placed",
  },
  {
    id: 5,
    name: "Rohan Mehta",
    department: "Engineering",
    branch: "EEE",
    cgpa: "6.8",
    drives: 6,
    applications: 3,
    interview: "Not Started",
    placement: "Not Placed",
  },
  {
    id: 6,
    name: "Priya Singh",
    department: "Engineering",
    branch: "IT",
    cgpa: "8.2",
    company: "Wipro",
    drives: 9,
    applications: 6,
    interview: "Completed",
    placement: "Placed",
  },
  {
    id: 7,
    name: "Vikram Joshi",
    department: "Engineering",
    branch: "ME",
    cgpa: "7.2",
    drives: 7,
    applications: 4,
    interview: "Scheduled",
    placement: "In Progress",
  },
  {
    id: 8,
    name: "Kavya Nair",
    department: "Engineering",
    branch: "CSE",
    cgpa: "9.0",
    company: "TCS",
    drives: 11,
    applications: 8,
    interview: "Completed",
    placement: "Placed",
  },
];

const dummyHiringUpdates: HiringUpdate[] = [
  {
    company: "TCS",
    selected: 32,
  },
  {
    company: "Infosys",
    selected: 27,
  },
  {
    company: "Accenture",
    selected: 24,
  },
  {
    company: "Deloitte",
    selected: 18,
  },
];

/* =========================================================
   CHART COLORS
========================================================= */

const chartColors = [
  "#1683FF",
  "#7C5CFF",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

/* =========================================================
   EMPTY CHART
========================================================= */

function EmptyChart({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-[#1E3045] bg-[#0B1422]">
      <div className="px-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#101C2C]">
          <BarChart3 className="h-5 w-5 text-[#1683FF]" />
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

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function PlacementOfficerDashboard() {

  /*
   * This is intentionally API-ready.
   *
   * Later:
   *
   * const response = await fetch("/api/dashboard");
   * const data = await response.json();
   *
   * Then update these states.
   */

  const [kpis, setKpis] = useState<KPI[]>(dummyKpis);

  const [departmentPlacementData, setDepartmentPlacementData] =
    useState<DepartmentPlacement[]>(
      dummyDepartmentPlacementData
    );

  const [yearPlacementData, setYearPlacementData] =
    useState<YearPlacement[]>(
      dummyYearPlacementData
    );

  const [companyHiringData, setCompanyHiringData] =
    useState<CompanyHiring[]>(
      dummyCompanyHiringData
    );

  const [salaryDistributionData, setSalaryDistributionData] =
    useState<SalaryDistribution[]>(
      dummySalaryDistributionData
    );

  const [ctcData, setCtcData] =
    useState<CTCData[]>(dummyCtcData);

  const [roleOffersData, setRoleOffersData] =
    useState<RoleOffer[]>(dummyRoleOffersData);

  const [monthlyHiringData, setMonthlyHiringData] =
    useState<MonthlyHiring[]>(
      dummyMonthlyHiringData
    );

  const [applicationSelectionData, setApplicationSelectionData] =
    useState<ApplicationSelection[]>(
      dummyApplicationSelectionData
    );

  const [selectionRateData, setSelectionRateData] =
    useState<SelectionRate[]>(
      dummySelectionRateData
    );

  const [recruitmentTrendData, setRecruitmentTrendData] =
    useState<RecruitmentTrend[]>(
      dummyRecruitmentTrendData
    );

  const [students, setStudents] =
    useState<Student[]>(dummyStudents);

  const [hiringUpdates, setHiringUpdates] =
    useState<HiringUpdate[]>(dummyHiringUpdates);

  /* =====================================================
     AUTHENTICATED USER
  ===================================================== */

  const [currentUser, setCurrentUser] =
    useState<AppUser | null>(null);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser");

      if (!storedUser) {
        setAuthLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      const allowedRoles: UserRole[] = [
        "student",
        "recruiter",
        "placement_officer",
        "system_administrator",
      ];

      if (
        parsedUser &&
        typeof parsedUser.name === "string" &&
        allowedRoles.includes(parsedUser.role)
      ) {
        setCurrentUser({
          name: parsedUser.name,
          role: parsedUser.role,
        });
      }
    } catch (error) {
      console.error(
        "Unable to read current user:",
        error
      );
    } finally {
      setAuthLoading(false);
    }
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Logout error:", error);
    }

    setCurrentUser(null);
  };

  /* =====================================================
     FILTERS
  ===================================================== */

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [placementStatus, setPlacementStatus] =
    useState("");
  const [academicYear, setAcademicYear] =
    useState("");

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const departmentOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.department)
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  const branchOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.branch)
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  const companyOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map((student) => student.company)
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  const cgpaOptions = [
    "9.0+",
    "8.0 - 8.99",
    "7.0 - 7.99",
    "6.0 - 6.99",
    "Below 6.0",
  ];

  /* =====================================================
     FUNCTIONAL FILTERING
  ===================================================== */

  const filteredStudents = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return students.filter((student) => {

      const matchesSearch =
        !normalizedSearch ||
        student.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.department
          .toLowerCase()
          .includes(normalizedSearch) ||
        student.branch
          .toLowerCase()
          .includes(normalizedSearch) ||
        (student.company ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        !department ||
        student.department === department;

      const matchesBranch =
        !branch ||
        student.branch === branch;

      const matchesCompany =
        !company ||
        student.company === company;

      const matchesPlacementStatus =
        !placementStatus ||
        student.placement === placementStatus;

      const numericCgpa =
        Number(student.cgpa) || 0;

      let matchesCgpa = true;

      if (cgpa === "9.0+") {
        matchesCgpa = numericCgpa >= 9;
      }

      if (cgpa === "8.0 - 8.99") {
        matchesCgpa =
          numericCgpa >= 8 &&
          numericCgpa < 9;
      }

      if (cgpa === "7.0 - 7.99") {
        matchesCgpa =
          numericCgpa >= 7 &&
          numericCgpa < 8;
      }

      if (cgpa === "6.0 - 6.99") {
        matchesCgpa =
          numericCgpa >= 6 &&
          numericCgpa < 7;
      }

      if (cgpa === "Below 6.0") {
        matchesCgpa = numericCgpa < 6;
      }

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesBranch &&
        matchesCompany &&
        matchesPlacementStatus &&
        matchesCgpa
      );
    });
  }, [
    students,
    search,
    department,
    branch,
    company,
    placementStatus,
    cgpa,
  ]);

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setCgpa("");
    setCompany("");
    setBranch("");
    setPlacementStatus("");
  };

  /* =====================================================
     AUTH LOADING
  ===================================================== */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B14] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#1E3045] border-t-[#1683FF]" />
          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     NO AUTHENTICATED USER
     -----------------------------------------------------
     No hardcoded user is created here.
     Later JWT authentication can populate currentUser.
  ===================================================== */

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050B14] text-white">
        <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-8 text-center">
          <Users className="mx-auto h-10 w-10 text-[#1683FF]" />

          <h1 className="mt-4 text-xl font-semibold">
            Authentication Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (
    <AppLayout
      user={currentUser}
      onLogout={handleLogout}
    >
      <div className="mx-auto max-w-[1600px]">

        {/* =================================================
            HEADER
        ================================================= */}

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

              <div className="relative">
                <select
                  value={academicYear}
                  onChange={(event) =>
                    setAcademicYear(event.target.value)
                  }
                  className="appearance-none rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2.5 pr-9 text-sm text-slate-300 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    Academic Year
                  </option>

                  <option value="2026-27">
                    2026-27
                  </option>

                  <option value="2025-26">
                    2025-26
                  </option>

                  <option value="2024-25">
                    2024-25
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>

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

        {/* =================================================
            KPI CARDS
        ================================================= */}

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

            {kpis.map((kpi) => (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                description={kpi.description}
              />
            ))}

          </div>
        </section>

        {/* =================================================
            HIRING UPDATES
        ================================================= */}

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

            {hiringUpdates.map((item) => (
              <div
                key={item.company}
                className="grid grid-cols-2 border-b border-[#1E3045] px-5 py-4 last:border-0"
              >
                <span className="text-sm text-slate-200">
                  {item.company}
                </span>

                <span className="text-right text-sm font-semibold text-[#1683FF]">
                  {item.selected}
                </span>
              </div>
            ))}

          </div>
        </section>

        {/* =================================================
            PLACEMENT SCENARIO
        ================================================= */}

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
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={departmentPlacementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="department"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#1683FF"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Department */}

            <ChartCard
              title="Department-wise Placement"
              description="Placement distribution by department"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart data={departmentPlacementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="department"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Bar
                    dataKey="placed"
                    fill="#1683FF"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Year */}

            <ChartCard
              title="Year-wise Placement"
              description="Placement performance across academic years"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={yearPlacementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="year"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="placed"
                    stroke="#7C5CFF"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Company */}

            <ChartCard
              title="Company-wise Hiring"
              description="Students hired by company"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart data={companyHiringData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="company"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Bar
                    dataKey="students"
                    fill="#7C5CFF"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Salary */}

            <ChartCard
              title="Salary Distribution"
              description="Distribution of offered salary packages"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart data={salaryDistributionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="range"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Bar
                    dataKey="students"
                    fill="#22C55E"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* CTC */}

            <ChartCard
              title="CTC Statistics"
              description="Compensation statistics across offers"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={ctcData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="range"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F59E0B"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Roles */}

            <ChartCard
              title="Offers by Role"
              description="Distribution of placement offers by role"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={roleOffersData}
                    dataKey="offers"
                    nameKey="role"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                  >
                    {roleOffersData.map((item, index) => (
                      <Cell
                        key={item.role}
                        fill={
                          chartColors[
                            index %
                              chartColors.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </section>

        {/* =================================================
            ELIGIBLE STUDENTS
        ================================================= */}

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

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#1683FF]" />

                <span className="text-sm font-medium text-white">
                  Filters
                </span>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-medium text-[#1683FF] hover:text-blue-400"
              >
                Clear Filters
              </button>

            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

              {/* Department */}

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Department
                </option>

                {departmentOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* CGPA */}

              <select
                value={cgpa}
                onChange={(event) =>
                  setCgpa(event.target.value)
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  CGPA
                </option>

                {cgpaOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* Company */}

              <select
                value={company}
                onChange={(event) =>
                  setCompany(event.target.value)
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Company
                </option>

                {companyOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* Branch */}

              <select
                value={branch}
                onChange={(event) =>
                  setBranch(event.target.value)
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Branch
                </option>

                {branchOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>

              {/* Placement Status */}

              <select
                value={placementStatus}
                onChange={(event) =>
                  setPlacementStatus(
                    event.target.value
                  )
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

            {/* SEARCH */}

            <div className="mt-3 flex items-center rounded-lg border border-[#1E3045] bg-[#0B1422] px-3">

              <Search className="h-4 w-4 shrink-0 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
              />

            </div>
          </div>

          {/* RESULT COUNT */}

          <div className="mb-3 text-xs text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {filteredStudents.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {students.length}
            </span>{" "}
            students
          </div>

          {/* =================================================
              RESPONSIVE TABLE
          ================================================= */}

          <div className="w-full overflow-x-auto rounded-xl border border-[#1E3045] bg-[#101C2C]">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-[#0B1422]">

                <tr className="border-b border-[#1E3045]">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Branch
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

                {filteredStudents.map((student) => (

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

                    <td className="px-5 py-4 text-sm text-slate-400">
                      {student.branch}
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

                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <Users className="mx-auto h-9 w-9 text-slate-600" />

                      <p className="mt-3 text-sm text-slate-400">
                        No students match the selected filters.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-xs font-medium text-[#1683FF]"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            HIRING TRENDS
        ================================================= */}

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

            <ChartCard
              title="Monthly Hiring"
              description="Monthly student hiring trend"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={monthlyHiringData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="hired"
                    stroke="#1683FF"
                    strokeWidth={3}
                  />

                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Applications vs Selections"
              description="Compare applications and successful selections"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart data={applicationSelectionData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

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
            </ChartCard>

            <ChartCard
              title="Selection Rate"
              description="Selection percentage over time"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={selectionRateData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#22C55E"
                    strokeWidth={3}
                  />

                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Company Recruitment Trends"
              description="Company recruitment activity over time"
            >
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <LineChart data={recruitmentTrendData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1E3045"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                  />

                  <YAxis stroke="#64748B" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="recruitments"
                    stroke="#7C5CFF"
                    strokeWidth={3}
                  />

                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        </section>

        {/* =================================================
            PLACEMENT INSIGHTS
        ================================================= */}

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

            <InsightCard
              title="Placement Performance"
              description="Placement insights will be generated from historical placement data."
              icon={TrendingUp}
            />

            <InsightCard
              title="Attention Required"
              description="Student application gaps and inactive eligible students will be highlighted here."
              icon={AlertTriangle}
              iconColor="text-[#F59E0B]"
              backgroundColor="bg-[#F59E0B]/10"
            />

            <InsightCard
              title="Recommendation"
              description="AI-based recommendations will appear here after placement analytics are connected."
              icon={Lightbulb}
              iconColor="text-[#7C5CFF]"
              backgroundColor="bg-[#7C5CFF]/10"
            />

          </div>
        </section>

      </div>
    </AppLayout>
  );
}