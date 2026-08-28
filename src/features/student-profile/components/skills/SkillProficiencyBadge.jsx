/**
 * SkillProficiencyBadge
 * Styled badge displaying proficiency level with appropriate color.
 * Beginner: Blue, Intermediate: Warning amber, Advanced: Success green
 */

const proficiencyConfig = {
  Beginner: { className: 'chip-primary', label: 'Beginner' },
  Intermediate: { className: 'chip-warning', label: 'Intermediate' },
  Advanced: { className: 'chip-success', label: 'Advanced' },
};

export default function SkillProficiencyBadge({ proficiency }) {
  const config = proficiencyConfig[proficiency] || proficiencyConfig.Beginner;
  
  return (
    <span className={`chip ${config.className}`}>
      {config.label}
    </span>
  );
}
