'use client';

import { GraduationCap } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#1A2B42]/60 py-2.5 last:border-b-0 max-md:flex-col max-md:gap-1">
      <span className="text-xs font-medium text-[#94A3B8]">{label}</span>
      <span className="text-right text-sm font-medium text-[#F1F5F9] max-md:text-left">
        {value || '—'}
      </span>
    </div>
  );
}

export default function AcademicInfoCard() {
  const { profile } = useStudentProfile();
  const a = profile.academicInfo;

  return (
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <GraduationCap className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Academic Information</h3>
      </div>
      <div className="px-6 py-2">
        <InfoRow label="Enrollment Number" value={a.universityEnrollmentNo} />
        <InfoRow label="College / Institute" value={a.college} />
        <InfoRow label="Department" value={a.department} />
        <InfoRow label="Degree" value={a.degree} />
        <InfoRow label="Current Semester" value={a.academicYear} />
        <InfoRow label="10th Percentage" value={a.sscPercentage ? `${a.sscPercentage}%` : '—'} />
        <InfoRow label="10th Passing Year" value={a.sscPassingYear} />
        <InfoRow label="12th Percentage" value={a.hscDiplomaPercentage ? `${a.hscDiplomaPercentage}%` : '—'} />
        <InfoRow label="12th Passing Year" value={a.hscDiplomaPassingYear} />
        <InfoRow label="Current CGPA" value={a.cgpaCurrent} />
        <InfoRow label="Live Backlogs" value={a.hasLiveBacklogs || 'No'} />
      </div>
    </div>
  );
}
