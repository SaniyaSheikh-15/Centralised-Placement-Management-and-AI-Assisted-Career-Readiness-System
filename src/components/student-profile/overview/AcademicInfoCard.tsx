'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GraduationCap } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 max-md:flex-col max-md:gap-1">
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>
      <span className="text-right text-sm font-semibold text-[var(--text-primary)] max-md:text-left">
        {value || '—'}
      </span>
    </div>
  );
}

export default function AcademicInfoCard() {
  const { profile } = useStudentProfile();
  const a = profile.academicInfo;

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <GraduationCap className="h-4 w-4 text-[var(--accent-primary)]" />
          Academic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <InfoRow label="Enrollment No." value={a.universityEnrollmentNo} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="College" value={a.college} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Degree" value={`${a.degree} — ${a.academicYear}`} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="SSC" value={`${a.sscPercentage}% (${a.sscPassingYear})`} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="HSC/Diploma" value={`${a.hscDiplomaPercentage}% (${a.hscDiplomaPassingYear})`} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="CGPA" value={String(a.cgpaCurrent)} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Live Backlogs" value={a.hasLiveBacklogs || 'N/A'} />
      </CardContent>
    </Card>
  );
}
