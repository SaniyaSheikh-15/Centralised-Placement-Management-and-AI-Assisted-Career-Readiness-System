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
      <ProfileHeaderBlock />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PersonalInfoCard />
        <AcademicInfoCard />
        <PlacementReadinessCard />
        <ProfessionalSummaryCard />
        <OnlinePresenceCard />
        <ResumeSummaryCard />
      </div>
    </div>
  );
}
