'use client';

import { User } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#1A2B42]/60 py-2.5 last:border-b-0 max-md:flex-col max-md:gap-1">
      <span className="text-xs font-medium text-[#94A3B8]">{label}</span>
      <span className="text-right text-sm font-medium text-[#F1F5F9] max-md:text-left">
        {value || '—'}
      </span>
    </div>
  );
}

function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 8) return aadhaar || '—';
  return `${aadhaar.slice(0, 4)} •••• ${aadhaar.slice(-4)}`;
}

export default function PersonalInfoCard() {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;

  return (
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <User className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Personal Information</h3>
      </div>
      <div className="px-6 py-2">
        <InfoRow label="Full Name" value={p.fullName} />
        <InfoRow label="Date of Birth" value={p.dateOfBirth} />
        <InfoRow label="Gender" value={p.gender} />
        <InfoRow label="Phone" value={p.phone} />
        <InfoRow label="Alt. Phone" value={p.altPhone} />
        <InfoRow label="Email" value={p.email} />
        <InfoRow label="Alt. Email" value={p.altEmail} />
        <InfoRow label="Father's Name" value={p.fatherName} />
        <InfoRow label="Mother's Name" value={p.motherName} />
        <InfoRow label="Father's Occupation" value={p.fatherOccupation} />
        <InfoRow label="Annual Family Income" value={p.annualFamilyIncome} />
        <InfoRow label="Religion" value={p.religion} />
        <InfoRow label="Category" value={p.category} />
        <InfoRow label="Aadhaar Card" value={maskAadhaar(p.aadhaarNumber)} />
        <InfoRow label="PAN Card" value={p.panNumber} />
        <InfoRow label="Branch" value={p.branch} />
      </div>
    </div>
  );
}
