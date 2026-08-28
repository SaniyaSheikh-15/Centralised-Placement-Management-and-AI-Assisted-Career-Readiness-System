'use client';

import { useState, useEffect } from 'react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import ResumeUploader from '@/components/student-profile/resume/ResumeUploader';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';

export default function ResumeUploadPage() {
  const { isLoading, error, simulateLoading, clearError } = useStudentProfile();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="form" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Resume Upload</h2>
        <p className="text-sm text-[var(--text-muted)]">Upload and manage your placement resume</p>
      </div>
      <ResumeUploader />
    </div>
  );
}
