'use client';

import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function EligibilityBanner() {
  const { profile } = useStudentProfile();
  const a = profile.academicInfo;
  const gradYear = a.graduationYear || 2026;
  const cgpa = Number(a.cgpaCurrent) || 8.42;
  const backlogs = a.hasLiveBacklogs === 'Yes' ? 1 : 0;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[#1A2B42] bg-gradient-to-r from-[#0E1B2E] via-[#0D223F] to-[#0E1B2E] p-5 shadow-lg animate-slide-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Info */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(22,131,255,0.15)] text-[#1683FF] border border-[rgba(22,131,255,0.3)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-[#F1F5F9]">
                Campus Placement Eligibility Status
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Drive Eligible
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Batch of <strong className="text-[#F1F5F9]">{gradYear}</strong> · CGPA <strong className="text-[#F1F5F9]">{cgpa}</strong> · {backlogs === 0 ? '0 Active Backlogs (Clean Record)' : `${backlogs} Backlog(s)`}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#1683FF]" />
                <span><strong className="text-white">4 of 5</strong> Campus Drives Match Your Criteria</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#7C5CFC]" />
                <span>AI Readiness Score: <strong className="text-white">88%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CTA Links */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile/eligibility"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0D6FE0] hover:shadow-[0_0_15px_rgba(22,131,255,0.4)]"
          >
            <span>Check Drive Eligibility</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/profile/drives"
            className="inline-flex items-center gap-2 rounded-lg border border-[#1A2B42] bg-[#0E1B2E] px-4 py-2.5 text-xs font-semibold text-[#94A3B8] transition-all hover:border-[#1683FF]/40 hover:text-white"
          >
            <span>View Drives</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
