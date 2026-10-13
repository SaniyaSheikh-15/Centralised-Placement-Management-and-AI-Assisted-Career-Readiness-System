'use client';

import {
  TrendingUp,
  BarChart2,
  Users,
  Target,
  Award,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function AnalyticsPage() {
  const { profile } = useStudentProfile();

  const metrics = [
    {
      title: 'Drive Match Rate',
      value: '84%',
      sub: 'Eligible for 18 out of 21 active campus drives',
      trend: '+12% this month',
      color: 'text-emerald-400',
    },
    {
      title: 'Aptitude Readiness',
      value: profile.placementReadiness.preparedForAptitude === 'Yes' ? '92%' : '85%',
      sub: 'Top 15% among Computer Engineering batch',
      trend: '+6% improvement',
      color: 'text-blue-400',
    },
    {
      title: 'Skills Percentile',
      value: '91st',
      sub: 'Based on 6 verified technical proficiencies',
      trend: 'Top Tier',
      color: 'text-purple-400',
    },
    {
      title: 'Interview Success Index',
      value: '88 / 100',
      sub: 'Calculated from mock scores & code assessments',
      trend: '+4 pts',
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#16263D] bg-gradient-to-r from-[#0C1A2E] via-[#0D2447] to-[#0A1626] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-[#60A5FA]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Placement Readiness Analytics</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Comprehensive performance breakdown across academics, aptitude scores, technical skill benchmarks, and mock interview trends.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#16263D] bg-[#0A1424] p-5 shadow-sm transition-all hover:border-[#1E4C8A]"
          >
            <div className="text-xs text-[#64748B]">{m.title}</div>
            <div className={`mt-2 text-2xl font-bold ${m.color}`}>{m.value}</div>
            <div className="mt-1 text-xs text-[#94A3B8]">{m.sub}</div>
            <div className="mt-3 inline-block rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {m.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Distribution Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#16263D] bg-[#0A1424] p-5 shadow-sm">
          <h3 className="font-bold text-white mb-4">Branch Placement Distribution Benchmark</h3>
          <div className="space-y-3">
            {[
              { label: 'High Placement Probability (Tier 1)', pct: '48%', width: 'w-[48%]' },
              { label: 'Competitive Profile (Tier 2)', pct: '34%', width: 'w-[34%]' },
              { label: 'Growth & Skill Building Needed', pct: '18%', width: 'w-[18%]' },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-[#94A3B8]">
                  <span>{d.label}</span>
                  <span className="font-semibold text-white">{d.pct}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#0E1B2E]">
                  <div className={`h-2 rounded-full bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] ${d.width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#16263D] bg-[#0A1424] p-5 shadow-sm">
          <h3 className="font-bold text-white mb-3">Profile Optimization Tips</h3>
          <ul className="space-y-2.5 text-xs text-[#94A3B8]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                Your CGPA ({profile.academicInfo.cgpaCurrent}) meets eligibility criteria for <strong>92%</strong> of visiting software firms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                Adding 1 Cloud or DevOps certification can increase your shortlisting rate by an estimated <strong>18%</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>
                Completing 2 more mock interview sessions unlocks our verified <strong>Elite Candidate</strong> badge.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
