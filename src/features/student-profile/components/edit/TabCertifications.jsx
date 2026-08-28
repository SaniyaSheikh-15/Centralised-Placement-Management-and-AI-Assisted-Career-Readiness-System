import { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import CertificationItem from '../certifications/CertificationItem';
import CertificationModal from '../certifications/CertificationModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import ProfileEmptyState from '../common/ProfileEmptyState';

/**
 * TabCertifications — Edit Tab 6
 * Embedded Certifications UI reusing certification components.
 */

export default function TabCertifications() {
  const { profile, addCertification, updateCertification, deleteCertification } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deletingCert, setDeletingCert] = useState(null);

  const certs = profile.certifications;

  const handleSubmit = (cert) => {
    if (editingCert) {
      updateCertification(editingCert.id, cert);
    } else {
      addCertification(cert);
    }
    setEditingCert(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {certs.length} certification{certs.length !== 1 ? 's' : ''} added
        </p>
        <button className="btn btn-sm btn-primary" onClick={() => { setEditingCert(null); setShowModal(true); }}>
          + Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <ProfileEmptyState icon="🏆" title="No certifications added yet" description="Add certifications to strengthen your profile." actionLabel="Add Certification" onAction={() => setShowModal(true)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {certs.map((c) => (
            <CertificationItem key={c.id} certification={c} onEdit={(cert) => { setEditingCert(cert); setShowModal(true); }} onDelete={(cert) => setDeletingCert(cert)} />
          ))}
        </div>
      )}

      <CertificationModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCert(null); }} onSubmit={handleSubmit} editingCert={editingCert} />
      <DeleteConfirmModal isOpen={!!deletingCert} title="Delete Certification" message={`Delete "${deletingCert?.name}"?`} onConfirm={() => { deleteCertification(deletingCert.id); setDeletingCert(null); }} onCancel={() => setDeletingCert(null)} />
    </div>
  );
}
