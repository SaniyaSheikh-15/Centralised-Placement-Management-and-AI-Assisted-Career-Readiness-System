'use client';

import Link from 'next/link';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  PlusCircle,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function SkillGapPage() {
  const { profile } = useStudentProfile();
  const currentSkills = profile.technicalSkills.map((s) => s.name);

  const marketBenchmarks = [
    {
      domain: 'Cloud & DevOps',
      urgency: 'High Demand in 85% of Drives',
      missing: ['Docker', 'AWS Fundamentals', 'CI/CD Pipelines'],
      relevance: 'Essential for SDE & DevOps placements (Microsoft, Amazon, Cisco)',
    },
    {
      domain: 'Backend Architecture',
      urgency: 'Medium Demand',
      missing: ['System Design Basics', 'Redis Caching', 'Microservices'],
      relevance: 'Recommended for Tier-1 Product Companies',
    },
    {
      domain: 'Testing & Quality',
      urgency: 'Standard Requirement',
      missing: ['Unit Testing (Jest/PyTest)', 'Integration Testing'],
      relevance: 'Boosts resume score across all software roles',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#16263D] bg-gradient-to-r from-[#0C1A2E] via-[#0D2447] to-[#0A1626] p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Skill Gap Analysis</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Targeted recommendations to upgrade your skillset and unlock top campus drive criteria.
              </p>
            </div>
          </div>
          <Link
            href="/profile/skills"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Manage My Skills</span>
          </Link>
        </div>
      </div>

      {/* Your Verified Skills */}
      <div className="rounded-xl border border-[#16263D] bg-[#0A1424] p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#64748B]">
          Your Acquired & Verified Skills ({profile.technicalSkills.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.technicalSkills.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
            >
              <CheckCircle2 className="h-3 w-3" />
              {s.name} ({s.proficiency})
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Upgrades */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Target Skills Recommended for High Placement Probability</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {marketBenchmarks.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl border border-[#16263D] bg-[#0A1424] p-5 transition-all hover:border-[#1E4C8A]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.domain}</span>
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                    {item.urgency}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#94A3B8]">{item.relevance}</p>
                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    High-Value Additions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.missing.map((m, j) => (
                      <span
                        key={j}
                        className="rounded-md border border-[#1E4C8A] bg-[#0E274D] px-2 py-1 text-xs font-medium text-blue-300"
                      >
                        + {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-[#131F33] pt-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between text-xs font-medium text-[#60A5FA] hover:underline"
                >
                  <span>Add to Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
