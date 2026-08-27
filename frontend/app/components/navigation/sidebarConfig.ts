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

import type { ComponentType } from "react";

/* =========================================================
   USER ROLES
========================================================= */

export type UserRole =
  | "student"
  | "recruiter"
  | "placement_officer"
  | "system_administrator";

/* =========================================================
   SIDEBAR ITEM
========================================================= */

export type SidebarItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

/* =========================================================
   ROLE-BASED SIDEBAR CONFIGURATION
========================================================= */

export const sidebarConfig: Record<
  UserRole,
  SidebarItem[]
> = {

  /* =======================================================
     STUDENT
  ======================================================= */

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

  /* =======================================================
     RECRUITER
  ======================================================= */

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

  /* =======================================================
     PLACEMENT OFFICER
  ======================================================= */

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
      label: "Students",
      href: "/students",
      icon: Users,
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

  /* =======================================================
     SYSTEM ADMINISTRATOR
  ======================================================= */

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