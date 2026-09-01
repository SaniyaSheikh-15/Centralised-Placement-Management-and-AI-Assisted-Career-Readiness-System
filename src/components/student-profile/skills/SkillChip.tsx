'use client';

import { Pencil, X } from 'lucide-react';
import SkillProficiencyBadge from './SkillProficiencyBadge';
import type { TechnicalSkill } from '@/types/student-profile';

interface SkillChipProps {
  skill: TechnicalSkill;
  onEdit?: (skill: TechnicalSkill) => void;
  onRemove?: (skill: TechnicalSkill) => void;
}

export default function SkillChip({ skill, onEdit, onRemove }: SkillChipProps) {
  return (
    <div className="group flex items-center justify-between border-b border-[#1A2B42] px-4 py-3.5 transition-colors last:border-b-0 hover:bg-[#122238]">
      <span className="text-sm font-medium text-[#F1F5F9]">{skill.name}</span>
      <div className="flex items-center gap-3">
        <SkillProficiencyBadge proficiency={skill.proficiency} />
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={() => onEdit(skill)}
              className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#F1F5F9]"
              title="Edit proficiency"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(skill)}
              className="rounded-md p-1.5 text-[#EF4444] transition-colors hover:bg-red-500/10"
              title="Remove skill"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
