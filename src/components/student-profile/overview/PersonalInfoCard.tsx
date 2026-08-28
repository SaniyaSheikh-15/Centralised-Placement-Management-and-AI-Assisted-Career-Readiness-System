'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Phone, Mail, MapPin, Users, IdCard } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 max-md:flex-col max-md:gap-1">
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>
      <span className="text-right text-sm font-semibold text-[var(--text-primary)] max-md:text-left">
        {value || '—'}
      </span>
    </div>
  );
}

export default function PersonalInfoCard() {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <User className="h-4 w-4 text-[var(--accent-primary)]" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <InfoRow label="Date of Birth" value={p.dateOfBirth} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Gender" value={p.gender} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Phone" value={p.phone} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Email" value={p.email} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Category" value={p.category} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Father's Name" value={p.fatherName} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Annual Family Income" value={p.annualFamilyIncome} />
      </CardContent>
    </Card>
  );
}
