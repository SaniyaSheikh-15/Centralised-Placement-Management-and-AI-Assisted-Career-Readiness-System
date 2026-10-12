'use client';

import { Briefcase } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ProfessionalSummaryCard() {
  const { profile } = useStudentProfile();

  return (
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <Briefcase className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Professional Summary</h3>
      </div>
      <div className="space-y-5 px-6 py-5">
        {/* Technical Skills */}
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Technical Skills
          </div>
          {profile.technicalSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.technicalSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md border border-[#1A2B42] bg-[#0A1524] px-2.5 py-1 text-xs font-medium text-[#94A3B8]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[#64748B]">No skills added yet</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1A2B42]/60" />

        {/* Soft Skills */}
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Soft Skills
          </div>
          {profile.softSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.softSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-[#1A2B42] bg-[#0A1524] px-2.5 py-1 text-xs font-medium text-[#94A3B8]"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[#64748B]">No soft skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
