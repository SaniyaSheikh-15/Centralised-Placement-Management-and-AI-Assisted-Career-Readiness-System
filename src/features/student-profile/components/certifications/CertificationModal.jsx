import { useState, useEffect } from 'react';

/**
 * CertificationModal
 * Add/Edit modal for certifications with fields:
 * Name (required), Organization (required), Issue Date, Credential Link.
 */

export default function CertificationModal({ isOpen, onClose, onSubmit, editingCert = null }) {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    date: '',
    link: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCert) {
      setFormData({
        name: editingCert.name || '',
        organization: editingCert.organization || '',
        date: editingCert.date || '',
        link: editingCert.link || '',
      });
    } else {
      setFormData({ name: '', organization: '', date: '', link: '' });
    }
    setErrors({});
  }, [editingCert, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Certification name is required';
    if (!formData.organization.trim()) errs.organization = 'Organization is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...(editingCert ? { id: editingCert.id } : {}),
      name: formData.name.trim(),
      organization: formData.organization.trim(),
      date: formData.date,
      link: formData.link.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingCert ? 'Edit Certification' : 'Add Certification'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Certification Name *</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. AWS Cloud Practitioner"
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Issuing Organization *</label>
              <input
                type="text"
                className={`form-input ${errors.organization ? 'error' : ''}`}
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                placeholder="e.g. Amazon Web Services"
              />
              {errors.organization && <span className="form-error">{errors.organization}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input
                type="month"
                className="form-input"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credential / Verification URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingCert ? 'Update Certification' : 'Add Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
