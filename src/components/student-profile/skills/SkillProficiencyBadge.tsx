import { Badge } from '@/components/ui/badge';
import type { TechnicalSkill } from '@/types/student-profile';

const proficiencyConfig: Record<string, { variant: 'default' | 'secondary' | 'outline'; className: string }> = {
  Beginner: { variant: 'secondary', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  Intermediate: { variant: 'secondary', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  Advanced: { variant: 'secondary', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function SkillProficiencyBadge({ proficiency }: { proficiency: TechnicalSkill['proficiency'] }) {
  const config = proficiencyConfig[proficiency] || proficiencyConfig.Beginner;
  return (
    <Badge variant={config.variant} className={config.className}>
      {proficiency}
    </Badge>
  );
}
