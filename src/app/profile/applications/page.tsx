'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Building2,
  Calendar,
  Filter,
} from 'lucide-react';

interface Application {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  currentRound: string;
  status: 'In Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Extended';
  statusColor: string;
  nextStep: string;
}

const mockApplications: Application[] = [
  {
    id: 'APP-101',
    company: 'Microsoft',
    role: 'Software Development Engineer I',
    appliedDate: 'Oct 08, 2026',
    currentRound: 'Technical Round 1 (DSA)',
    status: 'Interview Scheduled',
    statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    nextStep: 'Scheduled for Oct 22, 2026 at 2:30 PM IST',
  },
  {
    id: 'APP-102',
    company: 'Tata Consultancy Services',
    role: 'Digital Innovator / Full Stack',
    appliedDate: 'Oct 02, 2026',
    currentRound: 'Aptitude & Coding Assessment',
    status: 'Shortlisted',
    statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    nextStep: 'Awaiting Technical Interview Slot confirmation',
  },
  {
    id: 'APP-103',
    company: 'Amazon',
    role: 'Graduate Software Engineer',
    appliedDate: 'Oct 11, 2026',
    currentRound: 'Resume Screening & ATS Filter',
    status: 'In Review',
    statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    nextStep: 'Application undergoing recruiter screening',
  },
];

export default function ApplicationsPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#16263D] bg-gradient-to-r from-[#0C1A2E] via-[#0D2447] to-[#0A1626] p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-[#60A5FA]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Campus Applications Tracker</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Real-time tracking of your company applications, interview rounds, and offer statuses.
              </p>
            </div>
          </div>
          <Link
            href="/profile/drives"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] px-4 py-2 text-xs font-semibold text-white shadow-md hover:opacity-95"
          >
            <Building2 className="h-4 w-4" />
            <span>Explore Active Drives</span>
          </Link>
        </div>
      </div>

      {/* Applications List */}
      <div className="rounded-xl border border-[#16263D] bg-[#0A1424] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-[#131F33] pb-3">
          <h3 className="font-bold text-white">Submitted Applications ({mockApplications.length})</h3>
          <span className="text-xs text-[#64748B]">Updated 2 hours ago</span>
        </div>

        <div className="space-y-3">
          {mockApplications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-3 rounded-lg border border-[#16263D] bg-[#0D1829] p-4 transition-all hover:border-[#1E4C8A] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{app.role}</span>
                  <span className="text-xs text-[#64748B]">•</span>
                  <span className="text-xs font-medium text-[#60A5FA]">{app.company}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#64748B]" />
                    Applied: {app.appliedDate}
                  </span>
                  <span>•</span>
                  <span>Round: {app.currentRound}</span>
                </div>
                <div className="text-xs text-[#CBD5E1]">
                  Next Step: <span className="text-white font-medium">{app.nextStep}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${app.statusColor}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
