import SkillProficiencyBadge from './SkillProficiencyBadge';
import './SkillChip.css';

/**
 * SkillChip
 * Individual skill display with name, proficiency badge, edit, and remove actions.
 */

export default function SkillChip({ skill, onEdit, onRemove }) {
  return (
    <div className="skill-chip">
      <span className="skill-chip-name">{skill.name}</span>
      <SkillProficiencyBadge proficiency={skill.proficiency} />
      <div className="skill-chip-actions">
        {onEdit && (
          <button
            className="btn-icon btn-sm"
            onClick={() => onEdit(skill)}
            title="Edit proficiency"
            aria-label={`Edit ${skill.name} proficiency`}
          >
            ✏️
          </button>
        )}
        {onRemove && (
          <button
            className="btn-icon btn-sm"
            onClick={() => onRemove(skill)}
            title="Remove skill"
            aria-label={`Remove ${skill.name}`}
            style={{ color: 'var(--color-danger)' }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
