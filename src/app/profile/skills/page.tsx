'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import SkillChip from '@/components/student-profile/skills/SkillChip';
import AddSkillModal from '@/components/student-profile/skills/AddSkillModal';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import ProfileEmptyState from '@/components/student-profile/common/ProfileEmptyState';
import ProfileSkeletonLoader from '@/components/student-profile/common/ProfileSkeletonLoader';
import ProfileErrorState from '@/components/student-profile/common/ProfileErrorState';
import type { TechnicalSkill } from '@/types/student-profile';

export default function SkillsManagementPage() {
  const {
    profile, addSkill, updateSkillProficiency, removeSkill,
    isLoading, error, simulateLoading, clearError,
  } = useStudentProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<TechnicalSkill | null>(null);
  const [deletingSkill, setDeletingSkill] = useState<TechnicalSkill | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    simulateLoading(600).then(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSubmit = async (skill: {
      name: string;
      proficiency: TechnicalSkill['proficiency'];
    }) => {
      await addSkill(skill);
    };

    const handleEditSubmit = async (skill: {
      name: string;
      proficiency: TechnicalSkill["proficiency"];
    }) => {
      if (editingSkill) {
        await updateSkillProficiency(
          editingSkill.id,
          skill.proficiency
        );
      }

  setEditingSkill(null);
};

  const handleDeleteConfirm = async () => {
  if (deletingSkill) {
    await removeSkill(deletingSkill.id);
    setDeletingSkill(null);
  }
};

  if (isLoading && !loaded) return <ProfileSkeletonLoader variant="list" />;
  if (error) return <ProfileErrorState message={error} onRetry={clearError} />;

  const skills = profile.technicalSkills;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#F1F5F9]">Skills Management</h2>
          <p className="text-sm text-[#64748B]">Manage your technical skills and proficiency levels</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
        >
          <Plus className="h-4 w-4" />
          Add Skill
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
        <div className="overflow-hidden rounded-xl border border-[#1A2B42] bg-[#0E1B2E]">
          {skills.map((skill) => (
            <SkillChip key={skill.id} skill={skill} onEdit={(s) => setEditingSkill(s)} onRemove={(s) => setDeletingSkill(s)} />
          ))}
        </div>
      )}

      <AddSkillModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
      <AddSkillModal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} onSubmit={handleEditSubmit} editingSkill={editingSkill} />
      <DeleteConfirmModal isOpen={!!deletingSkill} title="Remove Skill" message={`Are you sure you want to remove "${deletingSkill?.name}" from your skills?`} confirmLabel="Remove Skill" onConfirm={handleDeleteConfirm} onCancel={() => setDeletingSkill(null)} />
    </div>
  );
}
