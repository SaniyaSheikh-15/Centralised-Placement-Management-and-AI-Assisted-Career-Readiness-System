import { useState, useMemo } from 'react';

/**
 * AddSkillModal
 * Modal form for adding/editing a skill with autocomplete suggestions
 * and proficiency dropdown (Beginner | Intermediate | Advanced).
 */

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP',
  'React.js', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'Linux', 'CI/CD', 'REST API', 'GraphQL',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV',
  'HTML', 'CSS', 'Sass', 'TailwindCSS', 'Bootstrap',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'SQL', 'NoSQL', 'Data Structures', 'Algorithms',
];

export default function AddSkillModal({ isOpen, onClose, onSubmit, editingSkill = null }) {
  const [name, setName] = useState(editingSkill?.name || '');
  const [proficiency, setProficiency] = useState(editingSkill?.proficiency || 'Beginner');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editingSkill;

  const filteredSuggestions = useMemo(() => {
    if (!name.trim()) return [];
    return COMMON_SKILLS.filter(
      (s) => s.toLowerCase().includes(name.toLowerCase()) && s.toLowerCase() !== name.toLowerCase()
    ).slice(0, 6);
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Skill name is required');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), proficiency });
    setName('');
    setProficiency('Beginner');
    onClose();
  };

  const handleSelectSuggestion = (suggestion) => {
    setName(suggestion);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Skill' : 'Add Skill'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Skill Name with autocomplete */}
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Skill Name</label>
              <input
                type="text"
                className={`form-input ${error ? 'error' : ''}`}
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="e.g. React.js, Python, Docker..."
                autoFocus
                disabled={isEditing}
              />
              {error && <span className="form-error">{error}</span>}

              {/* Autocomplete dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: 4,
                  zIndex: 10,
                  maxHeight: 200,
                  overflowY: 'auto',
                }}>
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: 'var(--space-2) var(--space-3)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--font-size-base)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--accent-primary-subtle)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proficiency Select */}
            <div className="form-group">
              <label className="form-label">Proficiency Level</label>
              <select
                className="form-select"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
