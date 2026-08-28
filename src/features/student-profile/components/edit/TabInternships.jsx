import { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import ProfileEmptyState from '../common/ProfileEmptyState';

/**
 * TabInternships — Edit Tab 5
 * Dynamic repeatable list editor: Organization, Role, Duration, Description.
 */

export default function TabInternships() {
  const { editDraft, addInternship, updateInternship, deleteInternship } = useStudentProfile();
  const [deletingIntern, setDeletingIntern] = useState(null);

  const internships = editDraft.internships;

  const handleAdd = () => {
    addInternship({ organization: '', role: '', duration: '', description: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {internships.length} internship{internships.length !== 1 ? 's' : ''} added
        </p>
        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
          + Add Internship
        </button>
      </div>

      {internships.length === 0 ? (
        <ProfileEmptyState
          icon="💼"
          title="No internships added yet"
          description="Add your internship experiences to highlight your practical knowledge."
          actionLabel="Add Internship"
          onAction={handleAdd}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {internships.map((intern, idx) => (
            <div key={intern.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                  INTERNSHIP {idx + 1}
                </span>
                <button
                  className="btn btn-icon btn-sm"
                  onClick={() => setDeletingIntern(intern)}
                  style={{ color: 'var(--color-danger)' }}
                  title="Remove internship"
                >
                  🗑️
                </button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <input className="form-input" value={intern.organization} onChange={(e) => updateInternship(intern.id, { organization: e.target.value })} placeholder="Company name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" value={intern.role} onChange={(e) => updateInternship(intern.id, { role: e.target.value })} placeholder="Job title / Role" />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input className="form-input" value={intern.duration} onChange={(e) => updateInternship(intern.id, { duration: e.target.value })} placeholder="e.g. Jun 2025 – Aug 2025" />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={intern.description} onChange={(e) => updateInternship(intern.id, { description: e.target.value })} placeholder="Describe your responsibilities and contributions..." rows={2} />
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deletingIntern}
        title="Remove Internship"
        message={`Remove this internship entry${deletingIntern?.organization ? ` at "${deletingIntern.organization}"` : ''}?`}
        confirmLabel="Remove"
        onConfirm={() => { deleteInternship(deletingIntern.id); setDeletingIntern(null); }}
        onCancel={() => setDeletingIntern(null)}
      />
    </div>
  );
}
