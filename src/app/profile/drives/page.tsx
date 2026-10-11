'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

interface PlacementDriveItem {
  id: string;
  company: string;
  role: string;
  type: string;
  location: string;
  packageLpa: string;
  vacancies: number;
  deadline: string;
  driveDate: string;
  status: 'active' | 'upcoming' | 'closed';
  minCgpa: number;
  gradYear: number;
  tags: string[];
}

const DRIVES_DATA: PlacementDriveItem[] = [
  {
    id: 'drv-01',
    company: 'Google India',
    role: 'Software Development Engineer I',
    type: 'Full-time',
    location: 'Bangalore (Hybrid)',
    packageLpa: '₹28.50 LPA',
    vacancies: 15,
    deadline: '2026-11-15',
    driveDate: '2026-11-28',
    status: 'active',
    minCgpa: 8.0,
    gradYear: 2026,
    tags: ['DSA', 'System Design', 'C++', 'Java', 'Python'],
  },
  {
    id: 'drv-02',
    company: 'Microsoft Corporation',
    role: 'Cloud Solution Engineer',
    type: 'Full-time',
    location: 'Hyderabad',
    packageLpa: '₹22.00 LPA',
    vacancies: 20,
    deadline: '2026-11-20',
    driveDate: '2026-12-05',
    status: 'active',
    minCgpa: 7.5,
    gradYear: 2026,
    tags: ['Azure', 'Distributed Systems', 'DevOps', 'TypeScript'],
  },
  {
    id: 'drv-03',
    company: 'Tata Consultancy Services (Digital)',
    role: 'Specialist Programmer',
    type: 'Full-time',
    location: 'Pune / Mumbai',
    packageLpa: '₹9.00 - 11.50 LPA',
    vacancies: 50,
    deadline: '2026-11-30',
    driveDate: '2026-12-10',
    status: 'active',
    minCgpa: 7.0,
    gradYear: 2026,
    tags: ['Full Stack', 'Cloud', 'Java', 'SQL'],
  },
  {
    id: 'drv-04',
    company: 'NVIDIA Graphics',
    role: 'Deep Learning & Systems Architect',
    type: 'Full-time',
    location: 'Bangalore',
    packageLpa: '₹26.00 LPA',
    vacancies: 8,
    deadline: '2026-11-10',
    driveDate: '2026-11-22',
    status: 'active',
    minCgpa: 8.75,
    gradYear: 2026,
    tags: ['CUDA', 'C++', 'PyTorch', 'Computer Vision'],
  },
  {
    id: 'drv-05',
    company: 'Qualcomm',
    role: 'Embedded Software Engineer',
    type: 'Full-time',
    location: 'Hyderabad',
    packageLpa: '₹19.50 LPA',
    vacancies: 12,
    deadline: '2026-12-01',
    driveDate: '2026-12-18',
    status: 'upcoming',
    minCgpa: 7.8,
    gradYear: 2026,
    tags: ['RTOS', 'Linux Kernel', 'C', 'Device Drivers'],
  },
  {
    id: 'drv-06',
    company: 'Amazon Web Services',
    role: 'Cloud Support Associate',
    type: 'Full-time',
    location: 'Bangalore',
    packageLpa: '₹16.00 LPA',
    vacancies: 25,
    deadline: '2026-12-15',
    driveDate: '2026-12-28',
    status: 'upcoming',
    minCgpa: 7.2,
    gradYear: 2026,
    tags: ['Networking', 'Linux', 'AWS', 'Security'],
  },
];

export default function PlacementDrivesPage() {
  const { profile } = useStudentProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  const studentCgpa = parseFloat(String(profile.academicInfo.cgpaCurrent)) || 8.42;

  const filteredDrives = DRIVES_DATA.filter((drive) => {
    const matchesSearch =
      drive.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || drive.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-6 md:flex-row md:items-center md:justify-between animate-slide-up">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(22,131,255,0.15)] text-[#1683FF]">
              <Briefcase className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold text-[#F1F5F9]">Campus Placement Drives</h1>
          </div>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Discover and apply to verified on-campus and virtual recruitment drives for the <strong>Class of {profile.academicInfo.graduationYear || '2026'}</strong>.
          </p>
        </div>

        <Link
          href="/profile/eligibility"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[rgba(22,131,255,0.4)] bg-[rgba(22,131,255,0.12)] px-4 py-2.5 text-xs font-semibold text-[#1683FF] transition-all hover:bg-[rgba(22,131,255,0.22)]"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Open Eligibility Engine</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] px-3.5 py-2.5 transition-colors focus-within:border-[#1683FF]">
          <Search className="h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, role, or tech skill..."
            className="w-full border-none bg-transparent text-sm text-[#F1F5F9] outline-none placeholder:text-[#64748B]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#1683FF] text-white shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All ({DRIVES_DATA.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active</span>
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === 'upcoming'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Clock className="h-3 w-3 text-amber-400" />
            <span>Upcoming</span>
          </button>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrives.map((drive) => {
          const isEligible = studentCgpa >= drive.minCgpa;

          return (
            <div
              key={drive.id}
              className="flex flex-col justify-between rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-5 transition-all duration-200 hover:border-[#1683FF]/50 hover:shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1683FF]/30 to-[#7C5CFC]/30 border border-[#1A2B42] text-base font-bold text-white">
                    {drive.company.charAt(0)}
                  </div>

                  <div className="flex items-center gap-2">
                    {drive.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Company & Role */}
                <div className="mt-3.5">
                  <h3 className="text-base font-bold text-[#F1F5F9]">{drive.company}</h3>
                  <p className="text-xs font-medium text-[#1683FF]">{drive.role}</p>
                </div>

                {/* Package & Details */}
                <div className="mt-4 space-y-2 text-xs text-[#94A3B8]">
                  <div className="flex items-center justify-between border-b border-[#1A2B42]/50 pb-2">
                    <span>Package (CTC)</span>
                    <span className="font-bold text-white">{drive.packageLpa}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1A2B42]/50 pb-2">
                    <span>Location</span>
                    <span className="text-[#F1F5F9]">{drive.location}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#1A2B42]/50 pb-2">
                    <span>Vacancies</span>
                    <span className="text-[#F1F5F9]">{drive.vacancies} Positions</span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span>Deadline</span>
                    <span className="font-medium text-rose-400">{drive.deadline}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {drive.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[#09111E] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8] border border-[#1A2B42]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-5 border-t border-[#1A2B42] pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isEligible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Eligible (Min {drive.minCgpa})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                      Requires {drive.minCgpa}+ CGPA
                    </span>
                  )}
                </div>

                <Link
                  href="/profile/eligibility"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1683FF] hover:underline"
                >
                  <span>Evaluate</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
