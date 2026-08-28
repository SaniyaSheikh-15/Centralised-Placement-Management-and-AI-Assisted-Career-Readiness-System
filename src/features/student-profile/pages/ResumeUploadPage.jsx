import { useState, useEffect } from 'react';
import { useStudentProfile } from '../context/StudentProfileContext';
import ResumeUploader from '../components/resume/ResumeUploader';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import ProfileEmptyState from '../components/common/ProfileEmptyState';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';

/**
 * ResumeUploadPage — /profile/resume
 * PDF drag-and-drop, client-side validation, progress simulation,
 * preview, download, replace, and confirmable delete.
 */

export default function ResumeUploadPage() {
  const { profile, deleteResume, isLoading, error, simulateLoading, clearError } = useStudentProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
  }, []);

  const hasResume = profile.resume.uploadedResume !== null;

  const handleDeleteConfirm = () => {
    deleteResume();
    setShowDeleteConfirm(false);
  };

  if (isLoading && !loaded) return (
    <div className="page-container">
      <ProfileSkeletonLoader variant="form" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <ProfileErrorState message={error} onRetry={clearError} />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Resume Upload</h2>
          <p className="page-subtitle">Upload and manage your resume (PDF only, max 5 MB)</p>
        </div>
      </div>

      <ResumeUploader />

      {/* Delete button (only when resume exists) */}
      {hasResume && (
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            🗑️ Delete Resume
          </button>
        </div>
      )}

      {/* Empty State */}
      {!hasResume && loaded && (
        <ProfileEmptyState
          icon="📄"
          title="No resume uploaded yet"
          description="Upload your resume as a PDF file to showcase your qualifications to placement recruiters."
          actionLabel="Upload PDF"
          onAction={() => document.getElementById('resume-file-input')?.click()}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Resume"
        message="Are you sure you want to delete your resume? You can upload a new one anytime."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
