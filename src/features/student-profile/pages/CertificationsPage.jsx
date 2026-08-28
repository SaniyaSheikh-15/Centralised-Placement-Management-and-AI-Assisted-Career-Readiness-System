import { useState, useEffect } from 'react';
import { useStudentProfile } from '../context/StudentProfileContext';
import CertificationItem from '../components/certifications/CertificationItem';
import CertificationModal from '../components/certifications/CertificationModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import ProfileEmptyState from '../components/common/ProfileEmptyState';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';

/**
 * CertificationsPage — /profile/certifications
 * Certifications list/card view with organization/date/link details,
 * add/edit/delete modals.
 */

export default function CertificationsPage() {
  const {
    profile, addCertification, updateCertification, deleteCertification,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deletingCert, setDeletingCert] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
  }, []);

  const handleSubmit = (cert) => {
    if (editingCert) {
      updateCertification(editingCert.id, cert);
    } else {
      addCertification(cert);
    }
    setEditingCert(null);
  };

  const handleEdit = (cert) => {
    setEditingCert(cert);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCert) {
      deleteCertification(deletingCert.id);
      setDeletingCert(null);
    }
  };

  if (isLoading && !loaded) return (
    <div className="page-container">
      <ProfileSkeletonLoader variant="list" />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <ProfileErrorState message={error} onRetry={clearError} />
    </div>
  );

  const certs = profile.certifications;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Certifications</h2>
          <p className="page-subtitle">Manage your professional certifications and credentials</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingCert(null); setShowModal(true); }}>
          + Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <ProfileEmptyState
          icon="🏆"
          title="No certifications added yet"
          description="Add your professional certifications to strengthen your profile."
          actionLabel="Add Certification"
          onAction={() => { setEditingCert(null); setShowModal(true); }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {certs.map((cert) => (
            <CertificationItem
              key={cert.id}
              certification={cert}
              onEdit={handleEdit}
              onDelete={(c) => setDeletingCert(c)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Certification Modal */}
      <CertificationModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCert(null); }}
        onSubmit={handleSubmit}
        editingCert={editingCert}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCert}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deletingCert?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCert(null)}
      />
    </div>
  );
}
