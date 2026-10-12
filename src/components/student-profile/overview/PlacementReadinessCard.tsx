'use client';

import { Target } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#1A2B42]/60 py-2.5 last:border-b-0 max-md:flex-col max-md:gap-1">
      <span className="text-xs font-medium text-[#94A3B8]">{label}</span>
      <span className="text-right text-sm font-medium text-[#F1F5F9] max-md:text-left">
        {String(value) || '—'}
      </span>
    </div>
  );
}

export default function PlacementReadinessCard() {
  const { profile } = useStudentProfile();
  const pr = profile.placementReadiness;

  return (
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <Target className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Placement Readiness</h3>
      </div>
      <div className="px-6 py-2">
        <InfoRow label="Interested in T&P Activities" value={pr.interestedInTpActivities} />
        <InfoRow label="Placement Status" value={pr.interestedInCollegePlacement === 'Yes' ? 'Seeking Placement' : pr.interestedInCollegePlacement} />
        <InfoRow label="Placement Preference" value={pr.areaOfInterestAfterGraduation} />
        <InfoRow label="Willing to Relocate" value={pr.readyToRelocate} />
      </div>
    </div>
  );
}
