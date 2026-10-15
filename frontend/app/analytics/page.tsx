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
  Legend,
} from "recharts";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
} from "react";

import AppLayout from "@/components/layout/AppLayout";
import type { AppUser } from "@/components/layout/AppLayout";
import type { UserRole } from "@/components/navigation/sidebarConfig";

/* =========================================================
   TYPES
========================================================= */

type KPI = {
  title: string;
  value: string;
  icon: ElementType;
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
  academicYear?: string;
};

type HiringUpdate = {
  company: string;
  selected: number;
};

/* =========================================================
   USER
========================================================= */

const developmentUser: AppUser = {
  name: "Placement Officer",
  role: "placement_officer" as UserRole,
};

/* =========================================================
   KPI CONFIG
========================================================= */

const kpiConfig: KPI[] = [
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

/* =========================================================
   DUMMY DATA
========================================================= */

const mockDashboardData = {
  kpis: [
    {
      title: "Total Students",
      value: "1248",
      icon: Users,
      description: "Registered students",
    },
    {
      title: "Eligible Students",
      value: "982",
      icon: GraduationCap,
      description: "Currently eligible",
    },
    {
      title: "Applications",
      value: "2864",
      icon: BriefcaseBusiness,
      description: "Total applications",
    },
    {
      title: "Students Placed",
      value: "764",
      icon: CheckCircle2,
      description: "Successfully placed",
    },
    {
      title: "Placement Rate",
      value: "77.8%",
      icon: TrendingUp,
      description: "Overall placement rate",
    },
    {
      title: "Active Drives",
      value: "18",
      icon: Activity,
      description: "Currently active",
    },
  ] as KPI[],

  departmentPlacement: [
    {
      department: "CSE",
      placed: 245,
      eligible: 290,
      rate: 84.5,
    },
    {
      department: "IT",
      placed: 198,
      eligible: 240,
      rate: 82.5,
    },
    {
      department: "ECE",
      placed: 156,
      eligible: 220,
      rate: 70.9,
    },
    {
      department: "EEE",
      placed: 92,
      eligible: 132,
      rate: 69.7,
    },
    {
      department: "ME",
      placed: 73,
      eligible: 100,
      rate: 73.0,
    },
  ] as DepartmentPlacement[],

  yearPlacement: [
    {
      year: "2022-23",
      placed: 620,
      eligible: 850,
    },
    {
      year: "2023-24",
      placed: 680,
      eligible: 900,
    },
    {
      year: "2024-25",
      placed: 720,
      eligible: 940,
    },
    {
      year: "2025-26",
      placed: 764,
      eligible: 982,
    },
  ] as YearPlacement[],

  companyHiring: [
    {
      company: "TCS",
      students: 126,
    },
    {
      company: "Infosys",
      students: 108,
    },
    {
      company: "Accenture",
      students: 96,
    },
    {
      company: "Wipro",
      students: 82,
    },
    {
      company: "Deloitte",
      students: 64,
    },
  ] as CompanyHiring[],

  salaryDistribution: [
    {
      range: "3-5 LPA",
      students: 286,
    },
    {
      range: "5-8 LPA",
      students: 244,
    },
    {
      range: "8-12 LPA",
      students: 142,
    },
    {
      range: "12-18 LPA",
      students: 64,
    },
    {
      range: "18+ LPA",
      students: 28,
    },
  ] as SalaryDistribution[],

  ctc: [
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
      value: 7.1,
    },
    {
      range: "Maximum",
      value: 24.5,
    },
  ] as CTCData[],

  roleOffers: [
    {
      role: "Software Engineer",
      offers: 210,
    },
    {
      role: "Data Analyst",
      offers: 86,
    },
    {
      role: "Business Analyst",
      offers: 72,
    },
    {
      role: "Consultant",
      offers: 58,
    },
    {
      role: "Other",
      offers: 42,
    },
  ] as RoleOffer[],

  monthlyHiring: [
    {
      month: "Jan",
      hired: 42,
    },
    {
      month: "Feb",
      hired: 56,
    },
    {
      month: "Mar",
      hired: 72,
    },
    {
      month: "Apr",
      hired: 68,
    },
    {
      month: "May",
      hired: 94,
    },
    {
      month: "Jun",
      hired: 112,
    },
  ] as MonthlyHiring[],

  applicationSelection: [
    {
      month: "Jan",
      applications: 280,
      selections: 42,
    },
    {
      month: "Feb",
      applications: 340,
      selections: 56,
    },
    {
      month: "Mar",
      applications: 410,
      selections: 72,
    },
    {
      month: "Apr",
      applications: 450,
      selections: 68,
    },
    {
      month: "May",
      applications: 520,
      selections: 94,
    },
    {
      month: "Jun",
      applications: 610,
      selections: 112,
    },
  ] as ApplicationSelection[],

  selectionRate: [
    {
      month: "Jan",
      rate: 15,
    },
    {
      month: "Feb",
      rate: 16.5,
    },
    {
      month: "Mar",
      rate: 17.6,
    },
    {
      month: "Apr",
      rate: 15.1,
    },
    {
      month: "May",
      rate: 18.1,
    },
    {
      month: "Jun",
      rate: 18.4,
    },
  ] as SelectionRate[],

  recruitmentTrend: [
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
      recruitments: 13,
    },
    {
      month: "May",
      recruitments: 18,
    },
    {
      month: "Jun",
      recruitments: 21,
    },
  ] as RecruitmentTrend[],

  students: [
    {
      id: 1,
      name: "Aarav Sharma",
      department: "CSE",
      branch: "Computer Science",
      cgpa: "9.2",
      company: "TCS",
      drives: 8,
      applications: 6,
      interview: "Completed",
      placement: "Placed",
      academicYear: "2025-26",
    },
    {
      id: 2,
      name: "Priya Patel",
      department: "IT",
      branch: "Information Technology",
      cgpa: "8.7",
      company: "Infosys",
      drives: 7,
      applications: 5,
      interview: "Completed",
      placement: "Placed",
      academicYear: "2025-26",
    },
    {
      id: 3,
      name: "Rohan Verma",
      department: "ECE",
      branch: "Electronics",
      cgpa: "7.8",
      company: "Accenture",
      drives: 6,
      applications: 4,
      interview: "Scheduled",
      placement: "In Progress",
      academicYear: "2025-26",
    },
    {
      id: 4,
      name: "Ananya Singh",
      department: "CSE",
      branch: "Computer Science",
      cgpa: "9.5",
      company: "Deloitte",
      drives: 9,
      applications: 7,
      interview: "Completed",
      placement: "Placed",
      academicYear: "2025-26",
    },
    {
      id: 5,
      name: "Aditya Joshi",
      department: "EEE",
      branch: "Electrical Engineering",
      cgpa: "7.2",
      company: "",
      drives: 5,
      applications: 3,
      interview: "Pending",
      placement: "Not Placed",
      academicYear: "2025-26",
    },
    {
      id: 6,
      name: "Sneha Kulkarni",
      department: "IT",
      branch: "Information Technology",
      cgpa: "8.3",
      company: "Wipro",
      drives: 7,
      applications: 5,
      interview: "Completed",
      placement: "Placed",
      academicYear: "2025-26",
    },
    {
      id: 7,
      name: "Karan Mehta",
      department: "ME",
      branch: "Mechanical Engineering",
      cgpa: "6.8",
      company: "",
      drives: 4,
      applications: 2,
      interview: "Pending",
      placement: "Not Placed",
      academicYear: "2025-26",
    },
    {
      id: 8,
      name: "Isha Deshmukh",
      department: "CSE",
      branch: "Computer Science",
      cgpa: "8.9",
      company: "Accenture",
      drives: 8,
      applications: 6,
      interview: "Completed",
      placement: "Placed",
      academicYear: "2025-26",
    },
  ] as Student[],

  hiringUpdates: [
    {
      company: "TCS",
      selected: 126,
    },
    {
      company: "Infosys",
      selected: 108,
    },
    {
      company: "Accenture",
      selected: 96,
    },
    {
      company: "Wipro",
      selected: 82,
    },
    {
      company: "Deloitte",
      selected: 64,
    },
  ] as HiringUpdate[],
};

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
   STATUS COLORS
========================================================= */

const getPlacementStatusClass = (status: string) => {
  switch (status) {
    case "Placed":
      return "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]";

    case "In Progress":
      return "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]";

    case "Not Placed":
      return "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]";

    default:
      return "border-[#1E3045] bg-[#0B1422] text-slate-400";
  }
};

/* =========================================================
   STATUS BADGE
========================================================= */

function PlacementStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${getPlacementStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
}

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
   CHART CARD
========================================================= */

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

/* =========================================================
   KPI ICON
========================================================= */

function KPIIcon({ Icon }: { Icon: ElementType }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1683FF]/10">
      <Icon className="h-5 w-5 text-[#1683FF]" />
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function PlacementOfficerDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [departmentPlacementData, setDepartmentPlacementData] =
    useState<DepartmentPlacement[]>([]);

  const [yearPlacementData, setYearPlacementData] =
    useState<YearPlacement[]>([]);

  const [companyHiringData, setCompanyHiringData] =
    useState<CompanyHiring[]>([]);

  const [salaryDistributionData, setSalaryDistributionData] =
    useState<SalaryDistribution[]>([]);

  const [ctcData, setCtcData] =
    useState<CTCData[]>([]);

  const [roleOffersData, setRoleOffersData] =
    useState<RoleOffer[]>([]);

  const [monthlyHiringData, setMonthlyHiringData] =
    useState<MonthlyHiring[]>([]);

  const [applicationSelectionData, setApplicationSelectionData] =
    useState<ApplicationSelection[]>([]);

  const [selectionRateData, setSelectionRateData] =
    useState<SelectionRate[]>([]);

  const [recruitmentTrendData, setRecruitmentTrendData] =
    useState<RecruitmentTrend[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [hiringUpdates, setHiringUpdates] =
    useState<HiringUpdate[]>([]);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [placementStatus, setPlacementStatus] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-26");

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const [currentUser, setCurrentUser] =
    useState<AppUser>(developmentUser);

  /* =======================================================
     LOAD DASHBOARD DATA
  ======================================================= */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

        setKpis(mockDashboardData.kpis);

        setDepartmentPlacementData(
          mockDashboardData.departmentPlacement
        );

        setYearPlacementData(
          mockDashboardData.yearPlacement
        );

        setCompanyHiringData(
          mockDashboardData.companyHiring
        );

        setSalaryDistributionData(
          mockDashboardData.salaryDistribution
        );

        setCtcData(mockDashboardData.ctc);

        setRoleOffersData(
          mockDashboardData.roleOffers
        );

        setMonthlyHiringData(
          mockDashboardData.monthlyHiring
        );

        setApplicationSelectionData(
          mockDashboardData.applicationSelection
        );

        setSelectionRateData(
          mockDashboardData.selectionRate
        );

        setRecruitmentTrendData(
          mockDashboardData.recruitmentTrend
        );

        setStudents(mockDashboardData.students);

        setHiringUpdates(
          mockDashboardData.hiringUpdates
        );
      } catch (error) {
        console.error(
          "Unable to load dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, [academicYear]);

  /* =======================================================
     LOAD CURRENT USER
  ======================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser");

      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser.name === "string" &&
        typeof parsedUser.role === "string"
      ) {
        const allowedRoles: UserRole[] = [
          "student",
          "recruiter",
          "placement_officer",
          "system_administrator",
        ];

        if (
          allowedRoles.includes(
            parsedUser.role as UserRole
          )
        ) {
          setCurrentUser({
            name: parsedUser.name,
            role: parsedUser.role as UserRole,
          });
        }
      }
    } catch (error) {
      console.error(
        "Unable to read current user:",
        error
      );
    }
  }, []);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
    } catch {
      // Ignore storage errors
    }

    console.log("Logout requested");
  };

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

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

  /* =======================================================
     FILTER STUDENTS
  ======================================================= */

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

      const matchesAcademicYear =
        !academicYear ||
        student.academicYear === academicYear;

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
        matchesAcademicYear &&
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
    academicYear,
    cgpa,
  ]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setCgpa("");
    setCompany("");
    setBranch("");
    setPlacementStatus("");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AppLayout
      user={currentUser}
      onLogout={handleLogout}
    >
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
                Monitor student placements, hiring activity
                and recruitment performance.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="relative">
                <select
                  value={academicYear}
                  onChange={(event) =>
                    setAcademicYear(
                      event.target.value
                    )
                  }
                  className="appearance-none rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2.5 pr-10 text-sm text-slate-300 outline-none focus:border-[#1683FF]"
                >
                  <option value="">
                    All Academic Years
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

            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              const isRate =
                kpi.title === "Placement Rate";

              return (
                <div
                  key={kpi.title}
                  className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5 transition hover:border-[#1683FF]/50"
                >
                  <KPIIcon Icon={Icon} />

                  <p className="mt-5 text-sm text-slate-400">
                    {kpi.title}
                  </p>

                  <div
                    className={`mt-1 min-h-[36px] text-2xl font-bold ${
                      isRate
                        ? "text-[#22C55E]"
                        : "text-white"
                    }`}
                  >
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

            {hiringUpdates.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-600" />

                  <p className="mt-3 text-sm text-slate-400">
                    No hiring updates available
                  </p>
                </div>
              </div>
            ) : (
              hiringUpdates.map((item) => (
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
              ))
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
              Analyze placement performance across departments,
              companies, years and compensation.
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
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <LineChart
                    data={departmentPlacementData}
                  >
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
                      stroke="#22C55E"
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
              {departmentPlacementData.length === 0 ? (
                <EmptyChart
                  title="No department data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <BarChart
                    data={departmentPlacementData}
                  >
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
              )}
            </ChartCard>

            {/* Year-wise */}

            <ChartCard
              title="Year-wise Placement"
              description="Placement performance across academic years"
            >
              {yearPlacementData.length === 0 ? (
                <EmptyChart
                  title="No yearly data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <LineChart
                    data={yearPlacementData}
                  >
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
              )}
            </ChartCard>

            {/* Company-wise */}

            <ChartCard
              title="Company-wise Hiring"
              description="Students hired by company"
            >
              {companyHiringData.length === 0 ? (
                <EmptyChart
                  title="No company hiring data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <BarChart
                    data={companyHiringData}
                  >
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
              )}
            </ChartCard>

            {/* Salary */}

            <ChartCard
              title="Salary Distribution"
              description="Distribution of offered salary packages"
            >
              {salaryDistributionData.length === 0 ? (
                <EmptyChart
                  title="No salary data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <BarChart
                    data={salaryDistributionData}
                  >
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
              )}
            </ChartCard>

            {/* CTC */}

            <ChartCard
              title="CTC Statistics"
              description="Compensation statistics across offers"
            >
              {ctcData.length === 0 ? (
                <EmptyChart
                  title="No CTC data"
                  description="Data will appear when API data is available."
                />
              ) : (
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
              )}
            </ChartCard>

            {/* Role */}

            <ChartCard
              title="Offers by Role"
              description="Distribution of placement offers by role"
            >
              {roleOffersData.length === 0 ? (
                <EmptyChart
                  title="No role data"
                  description="Data will appear when API data is available."
                />
              ) : (
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
                      {roleOffersData.map(
                        (_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend />
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
                onClick={clearFilters}
                className="text-xs font-medium text-[#1683FF] hover:text-blue-400"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">

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

            <div className="mt-3 flex items-center rounded-lg border border-[#1E3045] bg-[#0B1422] px-3">

              <Search className="h-4 w-4 shrink-0 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student, department, branch or company..."
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

          {/* TABLE */}

          <div className="w-full overflow-x-auto rounded-xl border border-[#1E3045] bg-[#101C2C]">

            <table className="min-w-[1200px] w-full">

              <thead className="bg-[#0B1422]">

                <tr className="border-b border-[#1E3045]">

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Department
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Branch
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    CGPA
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Eligible Drives
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Applications
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Interview Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Placement Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredStudents.length === 0 ? (

                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">

                        <Users className="h-9 w-9 text-slate-600" />

                        <p className="mt-3 text-sm text-slate-400">
                          No students found
                        </p>

                        <p className="mt-1 max-w-md text-xs text-slate-600">
                          Try changing your filters
                          or search term.
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

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-white">
                          {student.name}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                          {student.department}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                          {student.branch}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                          {student.cgpa}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                          {student.drives}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
                          {student.applications}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                          {student.interview}
                        </td>

                        {/* STATUS HIGHLIGHT */}

                        <td className="whitespace-nowrap px-5 py-4">
                          <PlacementStatusBadge
                            status={student.placement}
                          />
                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>
            </table>
          </div>
        </section>

        {/* HIRING TRENDS */}

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
                <BarChart
                  data={applicationSelectionData}
                >

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

                  <Legend />

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

            {/* SELECTION RATE — SEMANTIC GREEN */}

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

        {/* PLACEMENT INSIGHTS */}

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

            <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1683FF]/10">

                <TrendingUp className="h-5 w-5 text-[#1683FF]" />

              </div>

              <p className="mt-5 text-sm font-medium text-slate-300">
                Placement Performance
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Placement performance insights will be
                generated from historical placement data.
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
                eligible students will be highlighted here.
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
                after placement analytics are connected.
              </p>

            </div>

          </div>
        </section>

      </div>
    </AppLayout>
  );
}