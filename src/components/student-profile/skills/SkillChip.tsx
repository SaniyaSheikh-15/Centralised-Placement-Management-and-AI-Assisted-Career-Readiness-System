'use client';

import { Button } from '@/components/ui/button';
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
    <div className="group flex items-center gap-3 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 transition-all hover:border-[rgba(22,131,255,0.25)] hover:shadow-[var(--shadow-card-hover)]">
      <span className="flex-1 text-sm font-semibold text-[var(--text-primary)]">{skill.name}</span>
      <SkillProficiencyBadge proficiency={skill.proficiency} />
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(skill)} title="Edit proficiency">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
        {onRemove && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={() => onRemove(skill)} title="Remove skill">
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
