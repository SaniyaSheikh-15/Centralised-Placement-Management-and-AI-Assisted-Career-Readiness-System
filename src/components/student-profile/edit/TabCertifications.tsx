'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import CertificationItem from '@/components/student-profile/certifications/CertificationItem';
import CertificationModal from '@/components/student-profile/certifications/CertificationModal';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import type { Certification } from '@/types/student-profile';

export default function TabCertifications() {
  const { editDraft, addCertification, updateCertification, deleteCertification } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deletingCert, setDeletingCert] = useState<Certification | null>(null);

  const handleSubmit = (cert: Omit<Certification, 'id'>) => {
    if (editingCert) {
      updateCertification(editingCert.id, cert);
    } else {
      addCertification(cert);
    }
    setEditingCert(null);
    setShowModal(false);
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Certifications ({editDraft.certifications.length})</p>
        <Button size="sm" onClick={() => { setEditingCert(null); setShowModal(true); }}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Certification</Button>
      </div>

      {editDraft.certifications.length > 0 ? (
        <div className="space-y-3">
          {editDraft.certifications.map((cert) => (
            <CertificationItem key={cert.id} certification={cert} onEdit={handleEdit} onDelete={(c) => setDeletingCert(c)} />
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-[var(--text-muted)]">No certifications added yet.</p>
      )}

      <CertificationModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCert(null); }} onSubmit={handleSubmit} editingCert={editingCert} />
      <DeleteConfirmModal isOpen={!!deletingCert} title="Delete Certification" message={`Remove "${deletingCert?.name}"?`} onConfirm={() => { if (deletingCert) deleteCertification(deletingCert.id); setDeletingCert(null); }} onCancel={() => setDeletingCert(null)} />
    </div>
  );
}
