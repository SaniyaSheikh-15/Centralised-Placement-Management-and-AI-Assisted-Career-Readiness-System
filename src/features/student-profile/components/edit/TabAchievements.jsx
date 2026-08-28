import { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import ProfileEmptyState from '../common/ProfileEmptyState';

/**
 * TabAchievements — Edit Tab 7
 * Dynamic repeatable list editor: Title, Description, Date.
 */

export default function TabAchievements() {
  const { editDraft, addAchievement, updateAchievement, deleteAchievement } = useStudentProfile();
  const [deletingAch, setDeletingAch] = useState(null);

  const achievements = editDraft.achievements;

  const handleAdd = () => {
    addAchievement({ title: '', description: '', date: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} added
        </p>
        <button className="btn btn-sm btn-primary" onClick={handleAdd}>
          + Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <ProfileEmptyState
          icon="🌟"
          title="No achievements added yet"
          description="Add your notable achievements, awards, and recognitions."
          actionLabel="Add Achievement"
          onAction={handleAdd}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {achievements.map((ach, idx) => (
            <div key={ach.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                  ACHIEVEMENT {idx + 1}
                </span>
                <button
                  className="btn btn-icon btn-sm"
                  onClick={() => setDeletingAch(ach)}
                  style={{ color: 'var(--color-danger)' }}
                  title="Remove achievement"
                >
                  🗑️
                </button>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={ach.title} onChange={(e) => updateAchievement(ach.id, { title: e.target.value })} placeholder="Achievement title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="month" value={ach.date} onChange={(e) => updateAchievement(ach.id, { date: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 'var(--space-3)' }}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={ach.description} onChange={(e) => updateAchievement(ach.id, { description: e.target.value })} placeholder="Describe this achievement..." rows={2} />
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deletingAch}
        title="Remove Achievement"
        message={`Remove this achievement${deletingAch?.title ? `: "${deletingAch.title}"` : ''}?`}
        confirmLabel="Remove"
        onConfirm={() => { deleteAchievement(deletingAch.id); setDeletingAch(null); }}
        onCancel={() => setDeletingAch(null)}
      />
    </div>
  );
}
