import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Mic,
  ScanSearch,
  SearchCheck,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export type UserRole =
  | "student"
  | "recruiter"
  | "placement_officer"
  | "system_administrator";

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
};

export const sidebarConfig: Record<
  UserRole,
  SidebarItem[]
> = {
  student: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "Placement Drives",
      href: "/placement-drives",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      href: "/applications",
      icon: FileCheck2,
    },
    {
      label: "Eligibility",
      href: "/eligibility",
      icon: Gauge,
    },
    {
      label: "Resume Analyzer",
      href: "/resume-analyzer",
      icon: ScanSearch,
    },
    {
      label: "Placement Match",
      href: "/placement-match",
      icon: SearchCheck,
    },
    {
      label: "Skill Gap",
      href: "/skill-gap",
      icon: GraduationCap,
    },
    {
      label: "Assistant",
      href: "/assistant",
      icon: MessageCircle,
    },
    {
      label: "Mock Interview",
      href: "/mock-interview",
      icon: Mic,
    },
  ],

  recruiter: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "Placement Drives",
      href: "/placement-drives",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      href: "/applications",
      icon: FileCheck2,
    },
    {
      label: "Students",
      href: "/students",
      icon: Users,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
  ],

  placement_officer: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "All Students",
      href: "/students",
      icon: Users,
    },
    {
      label: "Eligible Students",
      href: "/eligibility",
      icon: Gauge,
    },
    {
      label: "Placement Drives",
      href: "/placement-drives",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      href: "/applications",
      icon: FileCheck2,
    },
    {
      label: "Companies",
      href: "/companies",
      icon: Building2,
    },
    {
      label: "Placement Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Hiring Trends",
      href: "/analytics/hiring-trends",
      icon: BarChart3,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],

  system_administrator: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "Students",
      href: "/students",
      icon: Users,
    },
    {
      label: "Placement Drives",
      href: "/placement-drives",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      href: "/applications",
      icon: FileCheck2,
    },
    {
      label: "Companies",
      href: "/companies",
      icon: Building2,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
};