"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Centralised Placement",
    description:
      "Manage placement drives, applications, eligibility, interviews, and recruitment activities through one central platform.",
  },
  {
    icon: BrainCircuit,
    title: "AI Career Readiness",
    description:
      "Help students understand their career readiness through intelligent profile, skill, resume, and interview analysis.",
  },
  {
    icon: Target,
    title: "Smart Placement Match",
    description:
      "Connect students with suitable placement opportunities based on their profile, skills, eligibility, and career goals.",
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    description:
      "Analyze resumes and identify areas that can be improved for stronger placement opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description:
      "Identify missing or underdeveloped skills and provide a clearer path toward target roles.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Role-Based Access",
    description:
      "Provide separate experiences for students, placement officers, recruiters, and administrators.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Build Profile",
    description:
      "Create and maintain a professional student profile with academic and career information.",
  },
  {
    number: "02",
    title: "Analyze Skills",
    description:
      "Use AI-assisted analysis to understand strengths, skills, and improvement areas.",
  },
  {
    number: "03",
    title: "Find Matches",
    description:
      "Discover placement opportunities that match the student's profile and eligibility.",
  },
  {
    number: "04",
    title: "Get Placed",
    description:
      "Prepare for applications, interviews, and the complete placement journey.",
  },
];

const aiPoints = [
  "Personalized career recommendations",
  "Resume analysis and improvement",
  "Skill gap identification",
  "Intelligent placement matching",
  "AI-assisted interview preparation",
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050B14] text-[#F8FAFC]">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-[#1E3045]/80 bg-[#050B14]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1683FF]/30 bg-[#1683FF]/10">
              <GraduationCap className="h-5 w-5 text-[#1683FF]" />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight">
                Placement<span className="text-[#1683FF]">AI</span>
              </div>

              <div className="text-[8px] uppercase tracking-[0.24em] text-[#64748B]">
                Career Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              How It Works
            </a>

            <a
              href="#ai"
              className="text-sm text-[#94A3B8] transition hover:text-[#F8FAFC]"
            >
              AI Career
            </a>

            <Link
              href="/login"
              className="rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2 text-sm font-medium text-[#F8FAFC] transition hover:border-[#1683FF]/50"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F73E5]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="rounded-lg border border-[#1E3045] bg-[#0B1422] p-2 text-[#94A3B8] md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-[#1E3045] bg-[#0B1422] px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-[#94A3B8] hover:bg-[#101C2C] hover:text-[#F8FAFC]"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-[#94A3B8] hover:bg-[#101C2C] hover:text-[#F8FAFC]"
              >
                How It Works
              </a>

              <a
                href="#ai"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-[#94A3B8] hover:bg-[#101C2C] hover:text-[#F8FAFC]"
              >
                AI Career
              </a>

              <Link
                href="/login"
                className="rounded-lg border border-[#1E3045] px-3 py-3 text-center text-sm font-medium"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#1683FF] px-3 py-3 text-center text-sm font-semibold"
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="relative">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#1683FF]/10 blur-[130px]" />

          <div className="absolute right-0 top-48 h-[300px] w-[300px] rounded-full bg-[#7C5CFF]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#1683FF]/20 bg-[#1683FF]/5 px-4 py-2 text-xs text-[#94A3B8]">
              <Sparkles className="h-3.5 w-3.5 text-[#7C5CFF]" />
              AI-Powered Placement Intelligence
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your Career.
              <br />
              <span className="bg-gradient-to-r from-[#1683FF] to-[#7C5CFF] bg-clip-text text-transparent">
                Your Future.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-[#94A3B8] sm:text-base">
              A centralised placement management platform connecting
              students, placement officers, recruiters, and institutions
              with intelligent AI-powered career readiness tools.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="flex h-12 items-center gap-2 rounded-lg bg-[#1683FF] px-6 text-sm font-semibold text-white shadow-lg shadow-[#1683FF]/10 transition hover:bg-[#0F73E5]"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#features"
                className="flex h-12 items-center gap-2 rounded-lg border border-[#1E3045] bg-[#0B1422] px-6 text-sm font-medium text-[#F8FAFC] transition hover:border-[#1683FF]/40"
              >
                Explore Platform
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product preview */}
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-[#1E3045] bg-[#0B1422] shadow-2xl shadow-black/30">
              {/* Browser bar */}
              <div className="flex h-10 items-center gap-2 border-b border-[#1E3045] bg-[#08111D] px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />

                <div className="ml-3 flex h-5 flex-1 items-center rounded-md border border-[#1E3045] bg-[#050B14] px-3 text-[8px] text-[#64748B]">
                  placement-ai.local
                </div>
              </div>

              <div className="grid min-h-[360px] grid-cols-1 md:grid-cols-[180px_1fr]">
                {/* Preview sidebar */}
                <div className="hidden border-r border-[#1E3045] bg-[#08111D] p-4 md:block">
                  <div className="mb-5 h-5 w-24 rounded bg-[#1683FF]/10" />

                  {[
                    "Dashboard",
                    "Placement Drives",
                    "Applications",
                    "Resume Analyzer",
                    "Skill Gap",
                    "Assistant",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-md px-3 py-2 text-[9px] ${
                        index === 0
                          ? "bg-[#1683FF]/10 text-[#1683FF]"
                          : "text-[#64748B]"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Preview content */}
                <div className="p-5 sm:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-32 rounded bg-[#F8FAFC]/10" />
                      <div className="mt-2 h-2 w-48 rounded bg-[#64748B]/20" />
                    </div>

                    <div className="h-8 w-8 rounded-full bg-[#7C5CFF]/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      "Student Profile",
                      "Placement Match",
                      "Career Readiness",
                      "AI Insights",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-4"
                      >
                        <div
                          className={`mb-4 h-7 w-7 rounded-lg ${
                            index % 2 === 0
                              ? "bg-[#1683FF]/10"
                              : "bg-[#7C5CFF]/10"
                          }`}
                        />

                        <div className="h-2 w-20 rounded bg-[#F8FAFC]/10" />

                        <div className="mt-2 h-2 w-14 rounded bg-[#64748B]/20" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-28 rounded bg-[#F8FAFC]/10" />
                        <BarChart3 className="h-4 w-4 text-[#1683FF]" />
                      </div>

                      <div className="mt-7 flex h-28 items-end gap-2">
                        {[45, 65, 50, 80, 60, 90, 72].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t bg-[#1683FF]/40"
                              style={{ height: `${height}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-[#7C5CFF]" />
                        <div className="h-3 w-28 rounded bg-[#F8FAFC]/10" />
                      </div>

                      <div className="mt-6 space-y-4">
                        {[
                          "Profile analysis",
                          "Skill assessment",
                          "Placement matching",
                          "Interview readiness",
                        ].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />

                            <div className="h-2 flex-1 rounded bg-[#F8FAFC]/10" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section
        id="features"
        className="border-y border-[#1E3045]/70 bg-[#07101B] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1683FF]">
              Platform
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need for your career journey.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#94A3B8]">
              One intelligent platform for discovering opportunities,
              preparing for interviews, improving skills, and managing
              the placement lifecycle.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-[#1E3045] bg-[#101C2C] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#1683FF]/40 hover:shadow-lg hover:shadow-[#1683FF]/5"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[#1683FF]/20 bg-[#1683FF]/10">
                    <Icon className="h-5 w-5 text-[#1683FF]" />
                  </div>

                  <h3 className="text-base font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                    {feature.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#1683FF]">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          AI SECTION
      ========================== */}
      <section id="ai" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-[#1E3045] bg-gradient-to-br from-[#101C2C] to-[#111127]">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1683FF] to-[#7C5CFF]">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C5CFF]">
                  AI Career Intelligence
                </p>

                <h2 className="mt-4 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                  Turn your skills into your next opportunity.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#94A3B8]">
                  AI-assisted tools help students understand their
                  readiness, identify skill gaps, improve resumes,
                  discover relevant opportunities, and prepare for
                  interviews.
                </p>

                <Link
                  href="/register"
                  className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0F73E5]"
                >
                  Explore AI Features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="flex flex-col justify-center gap-3">
                {aiPoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-lg border border-[#1E3045] bg-[#0B1422]/80 px-4 py-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                    </div>

                    <span className="text-sm text-[#F8FAFC]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        id="how-it-works"
        className="border-y border-[#1E3045]/70 bg-[#07101B] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1683FF]">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From profile to placement.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#94A3B8]">
              A simple workflow designed to help students become
              placement-ready.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-6"
              >
                <p className="text-xs font-semibold text-[#1683FF]">
                  {item.number}
                </p>

                <h3 className="mt-5 text-base font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1683FF]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Users className="mx-auto h-8 w-8 text-[#1683FF]" />

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Ready to build your career?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#94A3B8]">
            Join a centralised placement ecosystem designed for
            students, placement teams, recruiters, and institutions.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F73E5]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-[#1E3045]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-[#64748B]">
            © 2026 PlacementAI. Centralised Placement Management System.
          </div>

          <div className="flex items-center gap-5 text-xs text-[#64748B]">
            <a href="#" className="hover:text-[#F8FAFC]">
              Privacy
            </a>

            <a href="#" className="hover:text-[#F8FAFC]">
              Terms
            </a>

            <a href="#" className="hover:text-[#F8FAFC]">
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
