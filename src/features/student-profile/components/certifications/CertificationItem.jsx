import './CertificationItem.css';

/**
 * CertificationItem
 * Card/list item for a single certification with name, organization,
 * date, credential link, and edit/delete actions.
 */

export default function CertificationItem({ certification, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="cert-item card">
      <div className="cert-item-content">
        <div className="cert-item-icon">🏆</div>
        <div className="cert-item-details">
          <h4 className="cert-item-name">{certification.name}</h4>
          <p className="cert-item-org">{certification.organization}</p>
          <div className="cert-item-meta">
            <span className="cert-item-date">📅 {formatDate(certification.date)}</span>
            {certification.link && (
              <a
                href={certification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-item-link"
              >
                🔗 View Credential
              </a>
            )}
          </div>
        </div>
        <div className="cert-item-actions">
          <button
            className="btn btn-icon btn-sm"
            onClick={() => onEdit(certification)}
            title="Edit certification"
          >
            ✏️
          </button>
          <button
            className="btn btn-icon btn-sm"
            onClick={() => onDelete(certification)}
            title="Delete certification"
            style={{ color: 'var(--color-danger)' }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
