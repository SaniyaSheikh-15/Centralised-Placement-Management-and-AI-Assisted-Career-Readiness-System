import { useStudentProfile } from '../../context/StudentProfileContext';
import SkillProficiencyBadge from '../skills/SkillProficiencyBadge';

/** ProfessionalSummaryCard — Summary of skills, certs, internships, projects, achievements */
export default function ProfessionalSummaryCard() {
  const { profile } = useStudentProfile();

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">💼 Professional Summary</h3>
      </div>

      {/* Technical Skills */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>TECHNICAL SKILLS</h4>
        {profile.technicalSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {profile.technicalSkills.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <span className="chip chip-primary" style={{ fontSize: 'var(--font-size-xs)' }}>{s.name}</span>
                <SkillProficiencyBadge proficiency={s.proficiency} />
              </div>
            ))}
          </div>
        ) : (
          <span className="overview-section-empty">No skills added — <a href="/profile/skills">Add skills</a></span>
        )}
      </div>

      {/* Soft Skills */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>SOFT SKILLS</h4>
        {profile.softSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {profile.softSkills.map((s) => (
              <span key={s} className="chip chip-secondary">{s}</span>
            ))}
          </div>
        ) : (
          <span className="overview-section-empty">No soft skills added</span>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', paddingTop: 'var(--space-3)', borderTop: '1px solid rgba(30,48,69,0.5)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--accent-primary)' }}>{profile.certifications.length}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Certifications</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--accent-secondary)' }}>{profile.internships.length}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Internships</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-success)' }}>{profile.projects.length}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Projects</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-warning)' }}>{profile.achievements.length}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Achievements</div>
        </div>
      </div>
    </div>
  );
}
