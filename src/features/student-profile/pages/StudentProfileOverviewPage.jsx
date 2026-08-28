import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '../context/StudentProfileContext';
import ProfileHeaderBlock from '../components/overview/ProfileHeaderBlock';
import PersonalInfoCard from '../components/overview/PersonalInfoCard';
import AcademicInfoCard from '../components/overview/AcademicInfoCard';
import PlacementReadinessCard from '../components/overview/PlacementReadinessCard';
import ProfessionalSummaryCard from '../components/overview/ProfessionalSummaryCard';
import OnlinePresenceCard from '../components/overview/OnlinePresenceCard';
import ResumeSummaryCard from '../components/overview/ResumeSummaryCard';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';

/**
 * StudentProfileOverviewPage — /profile
 * Read-only comprehensive career profile summary with 6 section cards
 * and quick-navigation triggers.
 */

export default function StudentProfileOverviewPage() {
  const { isLoading, error, simulateLoading, clearError } = useStudentProfile();
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    simulateLoading(800).then(() => setLoaded(true));
  }, []);

  if (isLoading && !loaded) return (
    <div className="page-container">
      <ProfileSkeletonLoader variant="overview" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <ProfileErrorState message={error} onRetry={clearError} />
    </div>
  );

  return (
    <div className="page-container">
      {/* Header Block */}
      <ProfileHeaderBlock onEdit={() => navigate('/profile/edit')} />

      {/* Section Cards in 2-column grid */}
      <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
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
