'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  Building2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

interface PlacementMatchItem {
  id: string;
  company: string;
  role: string;
  logoInitial: string;
  gradient: string;
  matchScore: number;
  package: string;
  location: string;
  deadline: string;
  minCgpa: number;
  matchedSkills: string[];
  missingSkills: string[];
  status: 'High Match' | 'Good Match' | 'Potential Match';
}

const mockMatches: PlacementMatchItem[] = [
  {
    id: '1',
    company: 'Microsoft',
    role: 'Software Development Engineer I',
    logoInitial: 'MS',
    gradient: 'from-blue-600 to-cyan-500',
    matchScore: 92,
    package: '₹18.5 LPA',
    location: 'Hyderabad, India',
    deadline: 'Oct 28, 2026',
    minCgpa: 8.0,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'],
    missingSkills: ['System Design', 'Azure'],
    status: 'High Match',
  },
  {
    id: '2',
    company: 'Amazon',
    role: 'Graduate Software Engineer',
    logoInitial: 'AM',
    gradient: 'from-amber-500 to-orange-600',
    matchScore: 88,
    package: '₹16.0 LPA',
    location: 'Bengaluru, India',
    deadline: 'Nov 04, 2026',
    minCgpa: 7.5,
    matchedSkills: ['JavaScript', 'Python', 'REST APIs', 'SQL'],
    missingSkills: ['AWS', 'Distributed Systems'],
    status: 'High Match',
  },
  {
    id: '3',
    company: 'Tata Consultancy Services',
    role: 'Digital Innovator / Full Stack',
    logoInitial: 'TC',
    gradient: 'from-emerald-500 to-teal-600',
    matchScore: 96,
    package: '₹9.0 LPA',
    location: 'Pune / Mumbai',
    deadline: 'Nov 12, 2026',
    minCgpa: 7.0,
    matchedSkills: ['React', 'JavaScript', 'Python', 'Git', 'Agile'],
    missingSkills: [],
    status: 'High Match',
  },
  {
    id: '4',
    company: 'Infosys',
    role: 'Specialist Programmer (Power Programmer)',
    logoInitial: 'IN',
    gradient: 'from-indigo-600 to-purple-600',
    matchScore: 82,
    package: '₹9.5 LPA',
    location: 'Bengaluru / Pune',
    deadline: 'Nov 18, 2026',
    minCgpa: 7.5,
    matchedSkills: ['Python', 'SQL', 'Algorithms'],
    missingSkills: ['Docker', 'Kubernetes'],
    status: 'Good Match',
  },
  {
    id: '5',
    company: 'Accenture',
    role: 'Advanced App Engineering Analyst',
    logoInitial: 'AC',
    gradient: 'from-purple-600 to-pink-600',
    matchScore: 78,
    package: '₹6.5 LPA',
    location: 'Gurugram / Pune',
    deadline: 'Nov 25, 2026',
    minCgpa: 6.5,
    matchedSkills: ['JavaScript', 'HTML/CSS', 'Database Management'],
    missingSkills: ['CI/CD', 'Cloud Basics'],
    status: 'Potential Match',
  },
];

export default function PlacementMatchPage() {
  const { profile } = useStudentProfile();
  const [filterTier, setFilterTier] = useState<string>('all');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const filteredMatches = mockMatches.filter((m) => {
    if (filterTier === 'all') return true;
    if (filterTier === 'high') return m.matchScore >= 85;
    if (filterTier === 'good') return m.matchScore >= 75 && m.matchScore < 85;
    return true;
  });

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero Match Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#16263D] bg-gradient-to-r from-[#0C1A2E] via-[#0D2447] to-[#0A1626] p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-[#60A5FA]">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">AI Placement Match</h2>
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                  Live Engine
                </span>
              </div>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Algorithms match your CGPA ({profile.academicInfo.cgpaCurrent || '8.4'}), technical skills ({profile.technicalSkills.length} verified), and placement preferences against active campus recruitment criteria.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-xl border border-[#16263D] bg-[#0A1424] px-4 py-2 text-center">
              <div className="text-xl font-bold text-emerald-400">
                {mockMatches.filter((m) => m.matchScore >= 85).length}
              </div>
              <div className="text-[11px] text-[#64748B]">High Matches</div>
            </div>
            <div className="rounded-xl border border-[#16263D] bg-[#0A1424] px-4 py-2 text-center">
              <div className="text-xl font-bold text-[#60A5FA]">88.8%</div>
              <div className="text-[11px] text-[#64748B]">Avg Match Index</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#131F33] pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#64748B]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            Filter by Match Tier:
          </span>
          <div className="flex gap-1.5 ml-2">
            {[
              { id: 'all', label: 'All Matches' },
              { id: 'high', label: 'High Match (85%+)' },
              { id: 'good', label: 'Good Match (75-84%)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTier(tab.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  filterTier === tab.id
                    ? 'border border-[#1E4C8A] bg-[#0E274D] text-white'
                    : 'text-[#8E9EB5] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <Link
          href="/profile/skill-gap"
          className="flex items-center gap-1.5 text-xs font-medium text-[#60A5FA] hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>View Detailed Skill Gap Analysis</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredMatches.map((drive) => {
          const isApplied = appliedIds.includes(drive.id);
          const scoreColor =
            drive.matchScore >= 90
              ? 'text-emerald-400'
              : drive.matchScore >= 80
                ? 'text-blue-400'
                : 'text-amber-400';

          return (
            <div
              key={drive.id}
              className="group relative flex flex-col justify-between rounded-xl border border-[#16263D] bg-[#0A1424] p-5 transition-all duration-200 hover:border-[#1E4C8A] hover:bg-[#0C192E]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${drive.gradient} text-sm font-bold text-white shadow-md`}
                    >
                      {drive.logoInitial}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{drive.role}</h3>
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                        <span className="font-medium text-[#CBD5E1]">{drive.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {drive.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 rounded-full border border-[#1E4C8A] bg-[#0E274D] px-2.5 py-1">
                      <Target className={`h-3.5 w-3.5 ${scoreColor}`} />
                      <span className={`text-sm font-bold ${scoreColor}`}>
                        {drive.matchScore}%
                      </span>
                    </div>
                    <span className="mt-1 text-[10px] text-[#64748B]">{drive.status}</span>
                  </div>
                </div>

                {/* Compensation & Criteria */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-[#131F33] bg-[#070E1A] p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B]">Package</span>
                    <div className="font-semibold text-white">{drive.package}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B]">Min CGPA</span>
                    <div className="font-semibold text-white">{drive.minCgpa}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B]">Deadline</span>
                    <div className="font-semibold text-white">{drive.deadline}</div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    Skills Breakdown
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {drive.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {skill}
                      </span>
                    ))}
                    {drive.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400"
                      >
                        <AlertCircle className="h-2.5 w-2.5" />
                        {skill} (Gap)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-[#131F33] pt-4">
                <span className="text-xs text-[#64748B]">Campus Drive #CD-2026-{drive.id}</span>
                <button
                  onClick={() => handleApply(drive.id)}
                  disabled={isApplied}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                    isApplied
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] text-white shadow-md hover:opacity-95'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Applied Successfully
                    </>
                  ) : (
                    <>
                      <Briefcase className="h-3.5 w-3.5" />
                      Apply via CampusConnect
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
