'use client';

import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ProfileHeaderBlock() {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;

  const initials = p.fullName
    ? p.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-6 max-md:flex-col max-md:gap-4 max-md:text-center animate-slide-up">
      {/* Left — Avatar + Info */}
      <div className="flex items-center gap-4 max-md:flex-col">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#1683FF] to-[#7C5CFC] text-xl font-bold text-white">
          {p.profilePhoto ? (
            <img src={URL.createObjectURL(p.profilePhoto)} alt={p.fullName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        {/* Name + Info */}
        <div>
          <h2 className="text-xl font-bold text-[#F1F5F9]">
            {p.fullName || 'Unnamed Student'}
          </h2>
          <p className="text-sm font-semibold text-[#1683FF]">{p.branch || 'No branch set'}</p>
          <p className="text-xs text-[#94A3B8]">
            {profile.academicInfo.degree} ({profile.academicInfo.academicYear}) · {profile.academicInfo.college}
          </p>
        </div>
      </div>

      {/* Right — Edit Button */}
      <Link
        href="/profile/edit"
        className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
      >
        <Plus className="h-4 w-4" />
        Edit Profile
      </Link>
    </div>
  );
}
