'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import SkillChip from '@/components/student-profile/skills/SkillChip';
import AddSkillModal from '@/components/student-profile/skills/AddSkillModal';

export default function TabSkills() {
  const { editDraft, addSkill, updateSkillProficiency, removeSkill, updateSoftSkills } = useStudentProfile();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<null | typeof editDraft.technicalSkills[0]>(null);
  const [softInput, setSoftInput] = useState('');

  const handleAddSoftSkill = () => {
    const trimmed = softInput.trim();
    if (trimmed && !editDraft.softSkills.includes(trimmed)) {
      updateSoftSkills([...editDraft.softSkills, trimmed]);
    }
    setSoftInput('');
  };

  const removeSoftSkill = (skill: string) => {
    updateSoftSkills(editDraft.softSkills.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-6">
      {/* ─── Technical Skills ──────────────────── */}
      <fieldset className="space-y-4">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Technical Skills ({editDraft.technicalSkills.length})</legend>
          <Button size="sm" onClick={() => setShowAddModal(true)}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Skill</Button>
        </div>
        {editDraft.technicalSkills.length > 0 ? (
          <div className="flex flex-col gap-2">
            {editDraft.technicalSkills.map((skill) => (
              <SkillChip
                key={skill.id}
                skill={skill}
                onEdit={(s) => { setEditingSkill(s); }}
                onRemove={(s) => removeSkill(s.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-[var(--text-muted)]">No technical skills added yet. Click &quot;Add Skill&quot; to get started.</p>
        )}
      </fieldset>

      {/* ─── Soft Skills ───────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Soft Skills ({editDraft.softSkills.length})</legend>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input value={softInput} onChange={(e) => setSoftInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSoftSkill())} placeholder="e.g. Leadership, Teamwork, Communication..." />
          </div>
          <Button variant="secondary" onClick={handleAddSoftSkill} disabled={!softInput.trim()}>Add</Button>
        </div>
        {editDraft.softSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {editDraft.softSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1.5 bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] px-3 py-1.5">
                {skill}
                <button onClick={() => removeSoftSkill(skill)} className="ml-1 rounded-full hover:bg-white/10 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </fieldset>

      {/* Modals */}
      <AddSkillModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={(s) => addSkill(s)} />
      <AddSkillModal isOpen={!!editingSkill} onClose={() => setEditingSkill(null)} onSubmit={(s) => { if (editingSkill) updateSkillProficiency(editingSkill.id, s.proficiency); setEditingSkill(null); }} editingSkill={editingSkill} />
    </div>
  );
}
