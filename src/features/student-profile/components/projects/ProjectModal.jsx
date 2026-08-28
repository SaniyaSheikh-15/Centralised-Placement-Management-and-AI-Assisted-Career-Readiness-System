import { useState, useEffect } from 'react';

/**
 * ProjectModal
 * Add/Edit modal for projects with fields:
 * Project Name (required), Description (required), Tech Stack (tags),
 * GitHub Link (optional), Live Demo Link (optional).
 */

export default function ProjectModal({ isOpen, onClose, onSubmit, editingProject = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    techStackInput: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name || '',
        description: editingProject.description || '',
        techStackInput: '',
        techStack: editingProject.techStack || [],
        githubUrl: editingProject.githubUrl || '',
        liveUrl: editingProject.liveUrl || '',
      });
    } else {
      setFormData({ name: '', description: '', techStackInput: '', techStack: [], githubUrl: '', liveUrl: '' });
    }
    setErrors({});
  }, [editingProject, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleTechStackKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = formData.techStackInput.trim();
      if (tag && !formData.techStack.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          techStack: [...prev.techStack, tag],
          techStackInput: '',
        }));
      }
    }
  };

  const removeTechTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tag),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Project name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Add any remaining tech stack input
    let finalTechStack = [...formData.techStack];
    if (formData.techStackInput.trim()) {
      finalTechStack.push(formData.techStackInput.trim());
    }

    onSubmit({
      ...(editingProject ? { id: editingProject.id } : {}),
      name: formData.name.trim(),
      description: formData.description.trim(),
      techStack: finalTechStack,
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <h2 className="modal-title">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. CampusConnect Platform"
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your project..."
                rows={3}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Tech Stack</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: formData.techStack.length > 0 ? 'var(--space-2)' : 0 }}>
                {formData.techStack.map((tag) => (
                  <span key={tag} className="chip chip-secondary">
                    {tag}
                    <button type="button" className="chip-remove" onClick={() => removeTechTag(tag)}>✕</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="form-input"
                value={formData.techStackInput}
                onChange={(e) => handleChange('techStackInput', e.target.value)}
                onKeyDown={handleTechStackKeyDown}
                placeholder="Type and press Enter to add (e.g. React, Node.js)"
              />
              <span className="form-helper">Press Enter or comma to add tags</span>
            </div>

            <div className="form-group">
              <label className="form-label">GitHub Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Live Demo Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.liveUrl}
                onChange={(e) => handleChange('liveUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
