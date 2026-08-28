'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 max-md:flex-col max-md:gap-1">
      <span className="text-sm font-medium text-[var(--text-muted)]">{label}</span>
      <span className="text-right text-sm font-semibold text-[var(--text-primary)] max-md:text-left">
        {String(value) || '—'}
      </span>
    </div>
  );
}

export default function PlacementReadinessCard() {
  const { profile } = useStudentProfile();
  const pr = profile.placementReadiness;

  const ratingStars = '★'.repeat(pr.englishCommunicationRating) + '☆'.repeat(5 - pr.englishCommunicationRating);

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <Target className="h-4 w-4 text-[var(--accent-primary)]" />
          Placement Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <InfoRow label="TP Activities" value={pr.interestedInTpActivities} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="College Placement" value={pr.interestedInCollegePlacement} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="After Graduation" value={pr.areaOfInterestAfterGraduation} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Aptitude Prepared" value={pr.preparedForAptitude} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="English Rating" value={ratingStars} />
        <Separator className="bg-[var(--border-card)]" />
        <InfoRow label="Ready to Relocate" value={pr.readyToRelocate} />
      </CardContent>
    </Card>
  );
}
