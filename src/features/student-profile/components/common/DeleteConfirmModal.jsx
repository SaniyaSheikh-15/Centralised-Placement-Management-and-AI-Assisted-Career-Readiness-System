/**
 * DeleteConfirmModal
 * Standard destructive confirmation modal used for all delete actions:
 * Remove skill, delete project, delete certification, delete resume.
 * 
 * Props:
 *   isOpen: boolean
 *   title: string (e.g. "Delete Project")
 *   message: string (e.g. "Are you sure you want to delete this project?")
 *   confirmLabel: string (default: "Confirm Delete")
 *   onConfirm: () => void
 *   onCancel: () => void
 */

export default function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Delete',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Confirm Delete',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: 'var(--color-danger)' }}>
            {title}
          </h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-4)',
            background: 'var(--color-danger-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🗑️</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
