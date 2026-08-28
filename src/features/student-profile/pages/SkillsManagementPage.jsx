import { useState, useEffect } from 'react';
import { useStudentProfile } from '../context/StudentProfileContext';
import SkillChip from '../components/skills/SkillChip';
import AddSkillModal from '../components/skills/AddSkillModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import ProfileEmptyState from '../components/common/ProfileEmptyState';
import ProfileSkeletonLoader from '../components/common/ProfileSkeletonLoader';
import ProfileErrorState from '../components/common/ProfileErrorState';

/**
 * SkillsManagementPage — /profile/skills
 * Skills list with proficiency badges, autocomplete add modal,
 * inline edit, and delete confirm.
 */

export default function SkillsManagementPage() {
  const {
    profile, addSkill, updateSkillProficiency, removeSkill,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
  }, []);

  const handleAddSubmit = (skill) => {
    addSkill(skill);
  };

  const handleEditSubmit = (skill) => {
    if (editingSkill) {
      updateSkillProficiency(editingSkill.id, skill.proficiency);
    }
    setEditingSkill(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingSkill) {
      removeSkill(deletingSkill.id);
      setDeletingSkill(null);
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

  const skills = profile.technicalSkills;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Skills Management</h2>
          <p className="page-subtitle">Manage your technical skills and proficiency levels</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <ProfileEmptyState
          icon="⚡"
          title="No skills added yet"
          description="Add your technical skills to showcase your expertise to recruiters."
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

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Skill Modal */}
      <AddSkillModal
        isOpen={!!editingSkill}
        onClose={() => setEditingSkill(null)}
        onSubmit={handleEditSubmit}
        editingSkill={editingSkill}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingSkill}
        title="Remove Skill"
        message={`Are you sure you want to remove "${deletingSkill?.name}" from your skills?`}
        confirmLabel="Remove Skill"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSkill(null)}
      />
    </div>
  );
}
