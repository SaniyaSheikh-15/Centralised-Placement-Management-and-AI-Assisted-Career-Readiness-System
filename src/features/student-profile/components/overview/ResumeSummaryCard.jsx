import { useStudentProfile } from '../../context/StudentProfileContext';
import { useNavigate, Link } from 'react-router-dom';

/** ResumeSummaryCard — Current file info, preview, download, replace triggers */
export default function ResumeSummaryCard() {
  const { profile } = useStudentProfile();
  const navigate = useNavigate();
  const r = profile.resume;

  const hasResume = r.uploadedResume !== null;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="card overview-section-card">
      <div className="card-header">
        <h3 className="card-title">📄 Resume</h3>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate('/profile/resume')}>
          {hasResume ? 'Replace' : 'Upload'}
        </button>
      </div>

      {hasResume ? (
        <div className="file-info">
          <div className="file-info-icon">📄</div>
          <div className="file-info-details">
            <div className="file-info-name">{r.fileName}</div>
            <div className="file-info-meta">
              {formatFileSize(r.fileSize)} · {r.uploadDate ? new Date(r.uploadDate).toLocaleDateString() : ''}
            </div>
          </div>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (r.uploadedResume) {
                const url = URL.createObjectURL(r.uploadedResume);
                const a = document.createElement('a');
                a.href = url;
                a.download = r.fileName;
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
          >
            ⬇️ Download
          </button>
        </div>
      ) : (
        <span className="overview-section-empty">
          No resume uploaded — <Link to="/profile/resume">Upload PDF</Link>
        </span>
      )}
    </div>
  );
}
