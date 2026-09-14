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

import {
  getOverview,
  getPlacements,
  getApplications,
  getHiringTrends,
  getDepartmentWise,
  getYearWise,
  getCompanyWise,
  getSalaryDistribution,
  getRoleOffers,
  getCompanyRecruitmentTrends,
  getHiringUpdates,
  getPlacementInsights,
  getEligibleStudents,
} from "@/lib/analytics";

import type {
  EligibleStudent as ApiEligibleStudent,
  PlacementInsights,
} from "@/lib/analytics";

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
   SEMANTIC STATUS COLORS
========================================================= */

const placementStatusColors = {
  Placed: "#22C55E",
  "In Progress": "#F59E0B",
  "Not Placed": "#EF4444",
};

/* =========================================================
   HELPERS
========================================================= */

function graduationYearToAcademicYear(year: number): string {
  const previousYear = year - 1;

  return `${previousYear}-${String(year).slice(-2)}`;
}

function formatPlacementStatus(
  status?: string | null
): string {
  switch ((status ?? "").toUpperCase()) {
    case "SELECTED":
      return "Placed";

    case "REJECTED":
      return "Not Placed";

    case "IN_PROGRESS":
    case "APPLIED":
    case "SHORTLISTED":
    case "INTERVIEW":
      return "In Progress";

    default:
      return "In Progress";
  }
}

function formatInterviewStatus(
  status?: string | null
): string {
  if (!status) {
    return "Pending";
  }

  return status
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatMonth(month: string): string {
  if (!month) {
    return "";
  }

  const parts = month.split("-");

  if (parts.length !== 2) {
    return month;
  }

  const year = Number(parts[0]);
  const monthNumber = Number(parts[1]);

  if (
    Number.isNaN(year) ||
    Number.isNaN(monthNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return month;
  }

  const date = new Date(
    Date.UTC(year, monthNumber - 1, 1)
  );

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function mapApiStudent(
  student: ApiEligibleStudent
): Student {
  const academicYear =
    student.academic_year ?? undefined;

  return {
    id: student.student_id,
    name: student.student_name,
    department: student.department ?? "",
    branch: student.branch ?? "",
    cgpa:
      student.cgpa !== null &&
      student.cgpa !== undefined
        ? String(student.cgpa)
        : "—",
    company:
      student.company ?? undefined,
    drives: student.eligible_drives ?? 0,
    applications: student.applications ?? 0,
    interview: formatInterviewStatus(
      student.interview_status
    ),
    placement: formatPlacementStatus(
      student.placement_status
    ),
    academicYear,
  };
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

function KPIIcon({
  Icon,
}: {
  Icon: ElementType;
}) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1683FF]/10">
      <Icon className="h-5 w-5 text-[#1683FF]" />
    </div>
  );
}

/* =========================================================
   INSIGHT LIST
========================================================= */

function InsightList({
  items,
  emptyMessage,
}: {
  items: string[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-2"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />

          <span className="text-sm leading-6 text-slate-400">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function PlacementOfficerDashboard() {
  /* =======================================================
     API DATA STATE
  ======================================================= */

  const [kpis, setKpis] =
    useState<KPI[]>(kpiConfig);

  const [
    departmentPlacementData,
    setDepartmentPlacementData,
  ] = useState<DepartmentPlacement[]>([]);

  const [
    yearPlacementData,
    setYearPlacementData,
  ] = useState<YearPlacement[]>([]);

  const [
    companyHiringData,
    setCompanyHiringData,
  ] = useState<CompanyHiring[]>([]);

  const [
    salaryDistributionData,
    setSalaryDistributionData,
  ] = useState<SalaryDistribution[]>([]);

  const [ctcData, setCtcData] =
    useState<CTCData[]>([]);

  const [
    roleOffersData,
    setRoleOffersData,
  ] = useState<RoleOffer[]>([]);

  const [
    monthlyHiringData,
    setMonthlyHiringData,
  ] = useState<MonthlyHiring[]>([]);

  const [
    applicationSelectionData,
    setApplicationSelectionData,
  ] = useState<ApplicationSelection[]>([]);

  const [
    selectionRateData,
    setSelectionRateData,
  ] = useState<SelectionRate[]>([]);

  const [
    recruitmentTrendData,
    setRecruitmentTrendData,
  ] = useState<RecruitmentTrend[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [hiringUpdates, setHiringUpdates] =
    useState<HiringUpdate[]>([]);

  const [
    placementInsights,
    setPlacementInsights,
  ] = useState<PlacementInsights | null>(null);

  /* =======================================================
     LOADING / ERROR STATE
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [studentLoading, setStudentLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [studentError, setStudentError] =
    useState<string | null>(null);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [department, setDepartment] =
    useState("");

  const [cgpa, setCgpa] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [placementStatus, setPlacementStatus] =
    useState("");

  const [academicYear, setAcademicYear] =
    useState("");

  /* =======================================================
     CURRENT USER
  ======================================================= */

  const [currentUser, setCurrentUser] =
    useState<AppUser>(developmentUser);

  /* =======================================================
     LOAD MAIN ANALYTICS DATA
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          overview,
          placements,
          applications,
          hiringTrends,
          departmentWise,
          yearWise,
          companyWise,
          salaryDistribution,
          roleOffers,
          companyRecruitmentTrends,
          hiringUpdatesResponse,
          insights,
        ] = await Promise.all([
          getOverview(),
          getPlacements(),
          getApplications(),
          getHiringTrends(),
          getDepartmentWise(),
          getYearWise(),
          getCompanyWise(),
          getSalaryDistribution(),
          getRoleOffers(),
          getCompanyRecruitmentTrends(),
          getHiringUpdates(),
          getPlacementInsights(),
        ]);

        if (cancelled) {
          return;
        }

        /* =================================================
           KPI CARDS
        ================================================= */

        setKpis([
          {
            title: "Total Students",
            value: String(
              overview.total_students
            ),
            icon: Users,
            description:
              "Registered students",
          },
          {
            title: "Eligible Students",
            value: String(
              overview.eligible_students
            ),
            icon: GraduationCap,
            description:
              "Currently eligible",
          },
          {
            title: "Applications",
            value: String(
              overview.total_applications
            ),
            icon: BriefcaseBusiness,
            description:
              "Total applications",
          },
          {
            title: "Students Placed",
            value: String(
              overview.students_placed
            ),
            icon: CheckCircle2,
            description:
              "Successfully placed",
          },
          {
            title: "Placement Rate",
            value: `${Number(
              overview.placement_rate ?? 0
            ).toFixed(1)}%`,
            icon: TrendingUp,
            description:
              "Overall placement rate",
          },
          {
            title: "Active Drives",
            value: String(
              overview.active_drives
            ),
            icon: Activity,
            description:
              "Currently active",
          },
        ]);

        /* =================================================
           DEPARTMENT-WISE PLACEMENT
        ================================================= */

        setDepartmentPlacementData(
          departmentWise.map((item) => ({
            department:
              item.department,
            placed:
              item.students_placed,
            eligible:
              item.total_students,
            rate:
              item.placement_rate,
          }))
        );

        /* =================================================
           YEAR-WISE PLACEMENT
        ================================================= */

        setYearPlacementData(
          yearWise.map((item) => ({
            year:
              graduationYearToAcademicYear(
                item.graduation_year
              ),
            placed:
              item.students_placed,
            eligible:
              item.total_students,
          }))
        );

        /* =================================================
           COMPANY-WISE HIRING
        ================================================= */

        setCompanyHiringData(
          companyWise.map((item) => ({
            company:
              item.company_name,
            students:
              item.students_placed,
          }))
        );

        /* =================================================
           SALARY DISTRIBUTION
        ================================================= */

        setSalaryDistributionData(
          salaryDistribution.map((item) => ({
            range:
              item.salary_range,
            students:
              item.students,
          }))
        );

        /* =================================================
           CTC STATISTICS
        ================================================= */

        const ctc: CTCData[] = [];

        if (
          placements.lowest_package !==
            null &&
          placements.lowest_package !==
            undefined
        ) {
          ctc.push({
            range: "Minimum",
            value:
              placements.lowest_package,
          });
        }

        if (
          placements.average_package !==
            null &&
          placements.average_package !==
            undefined
        ) {
          ctc.push({
            range: "Average",
            value:
              placements.average_package,
          });
        }

        if (
          placements.highest_package !==
            null &&
          placements.highest_package !==
            undefined
        ) {
          ctc.push({
            range: "Maximum",
            value:
              placements.highest_package,
          });
        }

        setCtcData(ctc);

        /* =================================================
           OFFERS BY ROLE
        ================================================= */

        setRoleOffersData(
          roleOffers.map((item) => ({
            role: item.role,
            offers: item.offers,
          }))
        );

        /* =================================================
           MONTHLY HIRING + APPLICATIONS
        ================================================= */

        setMonthlyHiringData(
          hiringTrends.map((item) => ({
            month:
              formatMonth(item.month),
            hired:
              item.selections,
          }))
        );

        setApplicationSelectionData(
          hiringTrends.map((item) => ({
            month:
              formatMonth(item.month),
            applications:
              item.applications,
            selections:
              item.selections,
          }))
        );

        /* =================================================
           SELECTION RATE
        ================================================= */

        setSelectionRateData(
          hiringTrends.map((item) => {
            const rate =
              item.applications > 0
                ? (item.selections /
                    item.applications) *
                  100
                : 0;

            return {
              month:
                formatMonth(item.month),
              rate: Number(
                rate.toFixed(1)
              ),
            };
          })
        );

        /* =================================================
           COMPANY RECRUITMENT TRENDS
        ================================================= */

        const recruitmentByMonth =
          new Map<string, number>();

        companyRecruitmentTrends.forEach(
          (item) => {
            const current =
              recruitmentByMonth.get(
                item.month
              ) ?? 0;

            recruitmentByMonth.set(
              item.month,
              current + item.recruitments
            );
          }
        );

        setRecruitmentTrendData(
          Array.from(
            recruitmentByMonth.entries()
          )
            .sort(([a], [b]) =>
              a.localeCompare(b)
            )
            .map(
              ([month, recruitments]) => ({
                month:
                  formatMonth(month),
                recruitments,
              })
            )
        );

        /* =================================================
           HIRING UPDATES
        ================================================= */

        setHiringUpdates(
          hiringUpdatesResponse.map(
            (item) => ({
              company: item.company,
              selected: item.selected,
            })
          )
        );

        /* =================================================
           PLACEMENT INSIGHTS
        ================================================= */

        setPlacementInsights(insights);

        /*
         * Applications endpoint is still loaded as part
         * of the analytics layer and can be used by
         * future dashboard components.
         */
        void applications;
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Unable to load analytics data:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics data."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     LOAD ELIGIBLE STUDENTS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadEligibleStudents =
      async () => {
        setStudentLoading(true);
        setStudentError(null);

        try {
          const apiStudents =
            await getEligibleStudents({
              academic_year:
                academicYear ||
                undefined,

              department:
                department ||
                undefined,

              company:
                company ||
                undefined,

              branch:
                branch ||
                undefined,

              placement_status:
                placementStatus ||
                undefined,
            });

          if (cancelled) {
            return;
          }

          setStudents(
            apiStudents.map(mapApiStudent)
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Unable to load eligible students:",
            err
          );

          setStudents([]);

          setStudentError(
            err instanceof Error
              ? err.message
              : "Unable to load eligible students."
          );
        } finally {
          if (!cancelled) {
            setStudentLoading(false);
          }
        }
      };

    loadEligibleStudents();

    return () => {
      cancelled = true;
    };
  }, [
    academicYear,
    department,
    company,
    branch,
    placementStatus,
  ]);

  /* =======================================================
     LOAD CURRENT USER
  ======================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "currentUser"
        ) ||
        sessionStorage.getItem(
          "currentUser"
        );

      if (!storedUser) {
        return;
      }

      const parsedUser =
        JSON.parse(storedUser);

      if (
        parsedUser &&
        typeof parsedUser.name ===
          "string" &&
        typeof parsedUser.role ===
          "string"
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
            role:
              parsedUser.role as UserRole,
          });
        }
      }
    } catch (err) {
      console.error(
        "Unable to read current user:",
        err
      );
    }
  }, []);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    try {
      localStorage.removeItem(
        "currentUser"
      );

      sessionStorage.removeItem(
        "currentUser"
      );
    } catch {
      // Ignore storage errors.
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
          .map(
            (student) =>
              student.department
          )
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  const branchOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map(
            (student) =>
              student.branch
          )
          .filter(Boolean)
      )
    ).sort();
  }, [students]);

  const companyOptions = useMemo(() => {
    return Array.from(
      new Set(
        students
          .map(
            (student) =>
              student.company
          )
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

  const filteredStudents =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return students.filter(
        (student) => {
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

          const numericCgpa =
            Number(student.cgpa);

          let matchesCgpa = true;

          if (cgpa === "9.0+") {
            matchesCgpa =
              numericCgpa >= 9;
          }

          if (
            cgpa === "8.0 - 8.99"
          ) {
            matchesCgpa =
              numericCgpa >= 8 &&
              numericCgpa < 9;
          }

          if (
            cgpa === "7.0 - 7.99"
          ) {
            matchesCgpa =
              numericCgpa >= 7 &&
              numericCgpa < 8;
          }

          if (
            cgpa === "6.0 - 6.99"
          ) {
            matchesCgpa =
              numericCgpa >= 6 &&
              numericCgpa < 7;
          }

          if (cgpa === "Below 6.0") {
            matchesCgpa =
              numericCgpa < 6;
          }

          return (
            matchesSearch &&
            matchesCgpa
          );
        }
      );
    }, [
      students,
      search,
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
    setAcademicYear("");
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

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#EF4444]" />

            <div>
              <p className="text-sm font-medium text-red-300">
                Unable to load some dashboard data
              </p>

              <p className="mt-1 text-xs text-red-200/70">
                {error}
              </p>
            </div>
          </div>
        )}

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

            {kpis.map((kpi) => {
              const Icon = kpi.icon;

              const isPlacementRate =
                kpi.title ===
                "Placement Rate";

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
                      isPlacementRate
                        ? "text-[#22C55E]"
                        : "text-white"
                    }`}
                  >
                    {loading
                      ? "..."
                      : kpi.value || "—"}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {kpi.description}
                  </p>
                </div>
              );
            })}

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

            {loading ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <p className="text-sm text-slate-500">
                  Loading hiring updates...
                </p>
              </div>
            ) : hiringUpdates.length === 0 ? (
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

        {/* =================================================
            PLACEMENT SCENARIO
        ================================================= */}

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
                    data={
                      departmentPlacementData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="department"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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
                    data={
                      departmentPlacementData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="department"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

                    <Tooltip />

                    <Bar
                      dataKey="placed"
                      fill="#22C55E"
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
                    data={
                      yearPlacementData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="year"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="placed"
                      stroke="#22C55E"
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
                    data={
                      companyHiringData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="company"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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
                    data={
                      salaryDistributionData
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="range"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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
                  <LineChart
                    data={ctcData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="range"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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
                      data={
                        roleOffersData
                      }
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

        {/* =================================================
            ELIGIBLE STUDENTS
        ================================================= */}

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

              {/* Department */}

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(
                    event.target.value
                  )
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Department
                </option>

                {departmentOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>

              {/* CGPA */}

              <select
                value={cgpa}
                onChange={(event) =>
                  setCgpa(
                    event.target.value
                  )
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  CGPA
                </option>

                {cgpaOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>

              {/* Company */}

              <select
                value={company}
                onChange={(event) =>
                  setCompany(
                    event.target.value
                  )
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Company
                </option>

                {companyOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>

              {/* Branch */}

              <select
                value={branch}
                onChange={(event) =>
                  setBranch(
                    event.target.value
                  )
                }
                className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-[#1683FF]"
              >
                <option value="">
                  Branch
                </option>

                {branchOptions.map(
                  (option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  )
                )}
              </select>

              {/* Placement */}

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

                <option value="SELECTED">
                  Placed
                </option>

                <option value="REJECTED">
                  Not Placed
                </option>

                <option value="IN_PROGRESS">
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
                  setSearch(
                    event.target.value
                  )
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
              {studentLoading
                ? "..."
                : filteredStudents.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-slate-300">
              {studentLoading
                ? "..."
                : students.length}
            </span>{" "}

            students

          </div>

          {/* STUDENT ERROR */}

          {studentError && (
            <div className="mb-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4">
              <div className="flex items-start gap-3">

                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />

                <div>
                  <p className="text-sm font-medium text-red-300">
                    Unable to load eligible students
                  </p>

                  <p className="mt-1 text-xs text-red-200/70">
                    {studentError}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* RESPONSIVE TABLE */}

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

                {studentLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <Activity className="h-8 w-8 animate-pulse text-[#1683FF]" />

                        <p className="mt-3 text-sm text-slate-400">
                          Loading eligible students...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (

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
                    (student) => {

                      const placementColor =
                        placementStatusColors[
                          student.placement as keyof typeof placementStatusColors
                        ];

                      return (
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

                          <td
                            className="whitespace-nowrap px-5 py-4 text-sm font-medium"
                            style={{
                              color:
                                placementColor ||
                                "#94A3B8",
                            }}
                          >
                            {student.placement}
                          </td>

                        </tr>
                      );
                    }
                  )

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

            {/* Monthly Hiring */}

            <ChartCard
              title="Monthly Hiring"
              description="Monthly student hiring trend"
            >
              {monthlyHiringData.length ===
              0 ? (
                <EmptyChart
                  title="No hiring trend data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <LineChart
                    data={
                      monthlyHiringData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="hired"
                      stroke="#22C55E"
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
              {applicationSelectionData.length ===
              0 ? (
                <EmptyChart
                  title="No application data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <BarChart
                    data={
                      applicationSelectionData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="applications"
                      fill="#1683FF"
                    />

                    <Bar
                      dataKey="selections"
                      fill="#22C55E"
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
              {selectionRateData.length ===
              0 ? (
                <EmptyChart
                  title="No selection rate data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <LineChart
                    data={
                      selectionRateData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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
              {recruitmentTrendData.length ===
              0 ? (
                <EmptyChart
                  title="No recruitment trend data"
                  description="Data will appear when API data is available."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={280}
                >
                  <LineChart
                    data={
                      recruitmentTrendData
                    }
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1E3045"
                    />

                    <XAxis
                      dataKey="month"
                      stroke="#64748B"
                    />

                    <YAxis
                      stroke="#64748B"
                    />

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

        {/* =================================================
            PLACEMENT INSIGHTS
        ================================================= */}

        <section className="pb-8">

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-white">
              Placement Insights
            </h2>

            <p className="text-sm text-slate-500">
              Automated insights generated from PostgreSQL placement analytics.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* =================================================
                PLACEMENT PERFORMANCE
            ================================================= */}

            <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1683FF]/10">

                <TrendingUp className="h-5 w-5 text-[#1683FF]" />

              </div>

              <p className="mt-5 text-sm font-medium text-slate-300">
                Placement Performance
              </p>

              {loading ? (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Generating placement performance insights...
                </p>
              ) : (
                <div className="text-[#1683FF]">
                  <InsightList
                    items={
                      placementInsights?.placement_performance ??
                      []
                    }
                    emptyMessage="No placement performance insights are available."
                  />
                </div>
              )}

            </div>

            {/* =================================================
                ATTENTION REQUIRED
            ================================================= */}

            <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F59E0B]/10">

                <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />

              </div>

              <p className="mt-5 text-sm font-medium text-slate-300">
                Attention Required
              </p>

              {loading ? (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Checking placement risks and student gaps...
                </p>
              ) : (
                <div className="text-[#F59E0B]">
                  <InsightList
                    items={
                      placementInsights?.attention_required ??
                      []
                    }
                    emptyMessage="No major attention items were detected."
                  />
                </div>
              )}

            </div>

            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C5CFF]/10">

                <Lightbulb className="h-5 w-5 text-[#7C5CFF]" />

              </div>

              <p className="mt-5 text-sm font-medium text-slate-300">
                Recommendation
              </p>

              {loading ? (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Generating recommendations...
                </p>
              ) : (
                <div className="text-[#7C5CFF]">
                  <InsightList
                    items={
                      placementInsights?.recommendations ??
                      []
                    }
                    emptyMessage="No recommendations are currently available."
                  />
                </div>
              )}

            </div>

          </div>

        </section>

      </div>
    </AppLayout>
  );
}