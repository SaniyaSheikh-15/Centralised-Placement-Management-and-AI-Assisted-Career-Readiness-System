'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import CertificationItem from '@/components/student-profile/certifications/CertificationItem';
import CertificationModal from '@/components/student-profile/certifications/CertificationModal';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import ProfileEmptyState from '@/components/student-profile/common/ProfileEmptyState';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';
import type { Certification } from '@/types/student-profile';

export default function CertificationsPage() {
  const {
    profile, addCertification, updateCertification, deleteCertification,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deletingCert, setDeletingCert] = useState<Certification | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (cert: Omit<Certification, 'id'> & { id?: string }) => {
    if (editingCert) {
      updateCertification(editingCert.id, cert);
    } else {
      addCertification(cert);
    }
    setEditingCert(null);
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCert) {
      deleteCertification(deletingCert.id);
      setDeletingCert(null);
    }
  };

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="list" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  const certifications = profile.certifications;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Certifications</h2>
          <p className="text-sm text-[var(--text-muted)]">Manage your professional certifications and credentials</p>
        </div>
        <Button onClick={() => { setEditingCert(null); setShowModal(true); }}><Plus className="mr-1.5 h-4 w-4" /> Add Certification</Button>
      </div>

      {certifications.length === 0 ? (
        <ProfileEmptyState
          icon="🏆"
          title="No certifications added yet"
          description="Add your professional certifications to showcase your verified skills."
          actionLabel="Add Certification"
          onAction={() => { setEditingCert(null); setShowModal(true); }}
        />
      ) : (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <CertificationItem key={cert.id} certification={cert} onEdit={handleEdit} onDelete={(c) => setDeletingCert(c)} />
          ))}
        </div>
      )}

      <CertificationModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCert(null); }} onSubmit={handleSubmit} editingCert={editingCert} />
      <DeleteConfirmModal isOpen={!!deletingCert} title="Delete Certification" message={`Remove "${deletingCert?.name}"? This action cannot be undone.`} onConfirm={handleDeleteConfirm} onCancel={() => setDeletingCert(null)} />
    </div>
  );
}
