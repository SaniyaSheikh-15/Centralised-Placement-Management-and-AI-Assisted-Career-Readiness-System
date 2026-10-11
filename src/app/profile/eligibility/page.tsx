'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

interface DriveRule {
  id: string;
  companyName: string;
  role: string;
  employmentType: string;
  packageLpa: string;
  location: string;
  registrationDeadline: string;
  driveDate: string;
  minCgpa: number;
  maxBacklogs: number;
  graduationYear: number;
  minTenth: number;
  minTwelfth: number;
  branches: string[];
  color: string;
}

const SAMPLE_DRIVES: DriveRule[] = [
  {
    id: 'drv-01',
    companyName: 'Google India',
    role: 'Software Development Engineer I',
    employmentType: 'Full-time',
    packageLpa: '₹28.50 LPA',
    location: 'Bangalore, India (Hybrid)',
    registrationDeadline: '2026-11-15',
    driveDate: '2026-11-28',
    minCgpa: 8.0,
    maxBacklogs: 0,
    graduationYear: 2026,
    minTenth: 75.0,
    minTwelfth: 75.0,
    branches: ['Computer Science Engineering', 'Information Technology'],
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'drv-02',
    companyName: 'Microsoft Corporation',
    role: 'Cloud Solution Engineer',
    employmentType: 'Full-time',
    packageLpa: '₹22.00 LPA',
    location: 'Hyderabad, India',
    registrationDeadline: '2026-11-20',
    driveDate: '2026-12-05',
    minCgpa: 7.5,
    maxBacklogs: 0,
    graduationYear: 2026,
    minTenth: 70.0,
    minTwelfth: 70.0,
    branches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Telecommunication'],
    color: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'drv-03',
    companyName: 'Tata Consultancy Services (Digital)',
    role: 'Systems Engineer & Specialist Programmer',
    employmentType: 'Full-time',
    packageLpa: '₹9.00 - 11.50 LPA',
    location: 'Pune / Mumbai',
    registrationDeadline: '2026-11-30',
    driveDate: '2026-12-10',
    minCgpa: 7.0,
    maxBacklogs: 1,
    graduationYear: 2026,
    minTenth: 60.0,
    minTwelfth: 60.0,
    branches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Telecommunication', 'Mechanical Engineering'],
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'drv-04',
    companyName: 'NVIDIA Graphics',
    role: 'Deep Learning & Systems Architect',
    employmentType: 'Full-time',
    packageLpa: '₹26.00 LPA',
    location: 'Bangalore, India',
    registrationDeadline: '2026-11-10',
    driveDate: '2026-11-22',
    minCgpa: 8.75, // Intentionally higher than student's 8.42 to showcase criteria validation!
    maxBacklogs: 0,
    graduationYear: 2026,
    minTenth: 80.0,
    minTwelfth: 80.0,
    branches: ['Computer Science Engineering', 'Information Technology'],
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'drv-05',
    companyName: 'Qualcomm',
    role: 'Embedded Software Engineer',
    employmentType: 'Full-time',
    packageLpa: '₹19.50 LPA',
    location: 'Hyderabad, India',
    registrationDeadline: '2026-12-01',
    driveDate: '2026-12-18',
    minCgpa: 7.8,
    maxBacklogs: 0,
    graduationYear: 2026,
    minTenth: 65.0,
    minTwelfth: 65.0,
    branches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Telecommunication'],
    color: 'from-amber-600 to-orange-700',
  },
];

export default function EligibilityEnginePage() {
  const { profile } = useStudentProfile();
  const a = profile.academicInfo;
  const p = profile.personalInfo;

  const [activeFilter, setActiveFilter] = useState<'all' | 'eligible' | 'ineligible'>('all');
  const [appliedDriveIds, setAppliedDriveIds] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Student metrics
  const studentCgpa = parseFloat(String(a.cgpaCurrent)) || 8.42;
  const studentGradYear = parseInt(String(a.graduationYear)) || 2026;
  const studentBacklogs = a.hasLiveBacklogs === 'Yes' ? 1 : 0;
  const student10th = parseFloat(String(a.sscPercentage)) || 92.4;
  const student12th = parseFloat(String(a.hscDiplomaPercentage)) || 88.6;
  const studentBranch = p.branch || 'Computer Science Engineering';

  // Evaluate single drive
  const evaluateDrive = (drive: DriveRule) => {
    const cgpaOk = studentCgpa >= drive.minCgpa;
    const backlogsOk = studentBacklogs <= drive.maxBacklogs;
    const gradYearOk = studentGradYear === drive.graduationYear;
    const tenthOk = student10th >= drive.minTenth;
    const twelfthOk = student12th >= drive.minTwelfth;
    const branchOk = drive.branches.includes(studentBranch);

    const isEligible = cgpaOk && backlogsOk && gradYearOk && tenthOk && twelfthOk && branchOk;

    const reasons: string[] = [];
    if (!cgpaOk) reasons.push(`CGPA (${studentCgpa}) is below required minimum (${drive.minCgpa})`);
    if (!backlogsOk) reasons.push(`Active backlogs (${studentBacklogs}) exceed maximum allowed (${drive.maxBacklogs})`);
    if (!gradYearOk) reasons.push(`Batch (${studentGradYear}) does not match drive requirement (${drive.graduationYear})`);
    if (!tenthOk) reasons.push(`10th score (${student10th}%) is below required minimum (${drive.minTenth}%)`);
    if (!twelfthOk) reasons.push(`12th score (${student12th}%) is below required minimum (${drive.minTwelfth}%)`);
    if (!branchOk) reasons.push(`Branch "${studentBranch}" is not in the eligible branches list`);

    return {
      isEligible,
      checks: { cgpaOk, backlogsOk, gradYearOk, tenthOk, twelfthOk, branchOk },
      reasons,
    };
  };

  const handleApply = (driveId: string) => {
    if (!appliedDriveIds.includes(driveId)) {
      setAppliedDriveIds([...appliedDriveIds, driveId]);
    }
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const evaluatedDrives = SAMPLE_DRIVES.map((d) => ({
    ...d,
    ...evaluateDrive(d),
  }));

  const eligibleCount = evaluatedDrives.filter((d) => d.isEligible).length;
  const ineligibleCount = evaluatedDrives.filter((d) => !d.isEligible).length;

  const filteredDrives = evaluatedDrives.filter((d) => {
    if (activeFilter === 'eligible') return d.isEligible;
    if (activeFilter === 'ineligible') return !d.isEligible;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-6 animate-slide-up">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(22,131,255,0.15)] text-[#1683FF]">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold text-[#F1F5F9]">
                Placement Drive Eligibility Engine
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Automated institutional criteria engine verifying your academic profile against active company recruitment drives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-lg border border-[#1A2B42] bg-[#09111E] px-3.5 py-2 text-xs font-semibold text-[#94A3B8] transition-all hover:border-[#1683FF] hover:text-[#F1F5F9]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin text-[#1683FF]' : ''}`} />
              <span>{isScanning ? 'Evaluating...' : 'Re-verify Criteria'}</span>
            </button>
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1683FF] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#0D6FE0]"
            >
              <span>Update Academics</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Academic Parameter Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 border-t border-[#1A2B42] pt-5">
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">Graduation Batch</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#1683FF]">{studentGradYear}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">Current CGPA</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white">{studentCgpa.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">Live Backlogs</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-base font-bold ${studentBacklogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {studentBacklogs}
              </span>
              <span className="text-[10px] text-[#94A3B8] font-semibold">{studentBacklogs === 0 ? 'Clear' : 'Pending'}</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">10th Percentage</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white">{student10th}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">12th Percentage</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white">{student12th}%</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#09111E]/70 p-3 border border-[#1A2B42]/50">
            <span className="text-[11px] font-medium text-[#64748B]">Engineering Branch</span>
            <div className="mt-1">
              <span className="text-xs font-bold text-[#F1F5F9] truncate block" title={studentBranch}>
                {studentBranch.split(' ')[0]} Engg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#1683FF] text-white shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All Drives ({SAMPLE_DRIVES.length})
          </button>
          <button
            onClick={() => setActiveFilter('eligible')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === 'eligible'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Eligible ({eligibleCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('ineligible')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === 'ineligible'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            <span>Criteria Not Met ({ineligibleCount})</span>
          </button>
        </div>

        <div className="text-xs text-[#94A3B8]">
          Showing <strong className="text-white">{filteredDrives.length}</strong> active drive evaluations
        </div>
      </div>

      {/* Drives Evaluation Cards List */}
      <div className="space-y-4">
        {filteredDrives.map((drive) => {
          const isApplied = appliedDriveIds.includes(drive.id);

          return (
            <div
              key={drive.id}
              className={`rounded-xl border transition-all duration-200 bg-[#0E1B2E] p-6 ${
                drive.isEligible
                  ? 'border-[#1A2B42] hover:border-[#1683FF]/40'
                  : 'border-rose-950/40 opacity-90'
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Left Header */}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${drive.color} text-lg font-bold text-white shadow-md`}
                  >
                    {drive.companyName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-bold text-[#F1F5F9]">{drive.companyName}</h3>
                      {drive.isEligible ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Eligible to Apply
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">
                          <XCircle className="h-3 w-3" />
                          Criteria Not Met
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#1683FF]">{drive.role}</p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-semibold text-[#F1F5F9]">{drive.packageLpa}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-[#64748B]" />
                        <span>{drive.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#64748B]" />
                        <span>Deadline: <strong className="text-white">{drive.registrationDeadline}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex shrink-0 items-center gap-3">
                  {drive.isEligible ? (
                    <button
                      onClick={() => handleApply(drive.id)}
                      disabled={isApplied}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all ${
                        isApplied
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-[#1683FF] text-white hover:bg-[#0D6FE0] hover:shadow-[0_0_15px_rgba(22,131,255,0.35)]'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Application Submitted</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="rounded-lg border border-rose-900/40 bg-rose-950/20 px-3.5 py-1.5 text-xs font-medium text-rose-400">
                      Ineligible for this drive
                    </span>
                  )}
                </div>
              </div>

              {/* Eligibility Verification Breakdown Grid */}
              <div className="mt-5 rounded-lg border border-[#1A2B42] bg-[#09111E]/80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    Criteria Verification Breakdown
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    Target Batch: <strong className="text-[#1683FF]">{drive.graduationYear}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
                  {/* CGPA */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Min CGPA ({drive.minCgpa})</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.cgpaOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className={drive.checks.cgpaOk ? 'text-white font-medium' : 'text-rose-400 font-semibold'}>
                        {studentCgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Backlogs */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Max Backlogs ({drive.maxBacklogs})</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.backlogsOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-white font-medium">{studentBacklogs} active</span>
                    </div>
                  </div>

                  {/* Grad Year */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Grad Year ({drive.graduationYear})</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.gradYearOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-white font-medium">{studentGradYear}</span>
                    </div>
                  </div>

                  {/* 10th */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Min 10th ({drive.minTenth}%)</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.tenthOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-white font-medium">{student10th}%</span>
                    </div>
                  </div>

                  {/* 12th */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Min 12th ({drive.minTwelfth}%)</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.twelfthOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-white font-medium">{student12th}%</span>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex flex-col gap-1 rounded-md bg-[#0E1B2E] p-2.5 border border-[#1A2B42]/40">
                    <span className="text-[11px] text-[#64748B]">Branch Match</span>
                    <div className="flex items-center gap-1.5">
                      {drive.checks.branchOk ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      <span className="text-white font-medium truncate" title={studentBranch}>
                        Eligible
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ineligibility Warning if criteria failed */}
                {!drive.isEligible && drive.reasons.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-500/10 p-2.5 border border-rose-500/20 text-xs text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-rose-200">Reason for ineligibility: </strong>
                      {drive.reasons.join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
