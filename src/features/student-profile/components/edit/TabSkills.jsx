import { useState } from 'react';
import { useStudentProfile } from '../../context/StudentProfileContext';
import SkillChip from '../skills/SkillChip';
import AddSkillModal from '../skills/AddSkillModal';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import ProfileEmptyState from '../common/ProfileEmptyState';

/**
 * TabSkills — Edit Tab 3
 * Embedded Skills Management UI reusing skill components.
 */

export default function TabSkills() {
  const { profile, addSkill, updateSkillProficiency, removeSkill } = useStudentProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);

  const skills = profile.technicalSkills;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {skills.length} skill{skills.length !== 1 ? 's' : ''} added
        </p>
        <button className="btn btn-sm btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <ProfileEmptyState
          icon="⚡"
          title="No skills added yet"
          description="Add your technical skills and set proficiency levels."
          actionLabel="Add Skill"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {skills.map((skill) => (
            <SkillChip
              key={skill.id}
              skill={skill}
              onEdit={(s) => setEditingSkill(s)}
              onRemove={(s) => setDeletingSkill(s)}
            />
          ))}
        </div>
      )}

      <AddSkillModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={addSkill} />
      <AddSkillModal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} onSubmit={(s) => { updateSkillProficiency(editingSkill.id, s.proficiency); setEditingSkill(null); }} editingSkill={editingSkill} />
      <DeleteConfirmModal isOpen={!!deletingSkill} title="Remove Skill" message={`Remove "${deletingSkill?.name}"?`} confirmLabel="Remove" onConfirm={() => { removeSkill(deletingSkill.id); setDeletingSkill(null); }} onCancel={() => setDeletingSkill(null)} />
    </div>
  );
}
