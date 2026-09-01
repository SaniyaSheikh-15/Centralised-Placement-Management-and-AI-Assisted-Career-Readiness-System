import type { TechnicalSkill } from '@/types/student-profile';

const proficiencyConfig: Record<string, string> = {
  Beginner: 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40',
  Intermediate: 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40',
  Advanced: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
};

export default function SkillProficiencyBadge({ proficiency }: { proficiency: TechnicalSkill['proficiency'] }) {
  const className = proficiencyConfig[proficiency] || proficiencyConfig.Beginner;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      {proficiency}
    </span>
  );
}
