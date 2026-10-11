'use client';

import { useState, useEffect } from 'react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import ProfileHeaderBlock from '@/components/student-profile/overview/ProfileHeaderBlock';
import PersonalInfoCard from '@/components/student-profile/overview/PersonalInfoCard';
import AcademicInfoCard from '@/components/student-profile/overview/AcademicInfoCard';
import PlacementReadinessCard from '@/components/student-profile/overview/PlacementReadinessCard';
import ProfessionalSummaryCard from '@/components/student-profile/overview/ProfessionalSummaryCard';
import OnlinePresenceCard from '@/components/student-profile/overview/OnlinePresenceCard';
import ResumeSummaryCard from '@/components/student-profile/overview/ResumeSummaryCard';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';

export default function ProfileOverviewPage() {
  const { isLoading, error, simulateLoading, clearError } = useStudentProfile();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(800).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="overview" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <ProfileHeaderBlock />

      {/* Row 1: Personal + Academic */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard />
        <AcademicInfoCard />
      </div>

      {/* Divider */}
      <div className="mt-6 border-t border-[#1A2B42]" />

      {/* Row 2: Placement Readiness + Professional Summary */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PlacementReadinessCard />
        <ProfessionalSummaryCard />
      </div>

      {/* Divider */}
      <div className="mt-6 border-t border-[#1A2B42]" />

      {/* Row 3: Online Presence + Resume */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <OnlinePresenceCard />
        <ResumeSummaryCard />
      </div>
    </div>
  );
}
