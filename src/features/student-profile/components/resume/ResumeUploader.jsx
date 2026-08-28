import { useState, useRef, useCallback } from 'react';
import { validateResumeFile } from '../../utils/profileValidation';
import { useStudentProfile } from '../../context/StudentProfileContext';
import './ResumeUploader.css';

/**
 * ResumeUploader
 * Drag-and-drop zone with PDF restriction, size validation,
 * upload progress simulation, and preview/download/replace/delete actions.
 */

export default function ResumeUploader() {
  const { profile, setResume, deleteResume } = useStudentProfile();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const hasResume = profile.resume.uploadedResume !== null;

  const handleFile = useCallback((file) => {
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setResume(file);
          // Create preview URL
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }, 400);
      } else {
        setProgress(Math.round(current));
      }
    }, 200);
  }, [setResume]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const handleDownload = useCallback(() => {
    if (profile.resume.uploadedResume) {
      const url = URL.createObjectURL(profile.resume.uploadedResume);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile.resume.fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [profile.resume]);

  const handleReplace = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="resume-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        id="resume-file-input"
      />

      {/* Upload Zone (shown when no resume or replacing) */}
      {!hasResume && !uploading && (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">📄</div>
          <div className="upload-zone-text">
            Drag & drop your resume here, or <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>browse files</span>
          </div>
          <div className="upload-zone-hint">PDF files only · Max 5 MB</div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: '1.5rem' }}>📤</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Uploading resume...</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700, marginLeft: 'auto' }}>{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="inline-alert inline-alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Current Resume State Block */}
      {hasResume && !uploading && (
        <div className="resume-current-state">
          <div className="file-info">
            <div className="file-info-icon">📄</div>
            <div className="file-info-details">
              <div className="file-info-name">{profile.resume.fileName}</div>
              <div className="file-info-meta">
                {formatFileSize(profile.resume.fileSize)} · Uploaded {formatDate(profile.resume.uploadDate)}
              </div>
            </div>
            <div className="file-info-actions">
              <button className="btn btn-sm btn-secondary" onClick={handleDownload} title="Download">
                ⬇️ Download
              </button>
              <button className="btn btn-sm btn-ghost" onClick={handleReplace} title="Replace">
                🔄 Replace
              </button>
            </div>
          </div>

          {/* Preview Container */}
          {previewUrl && (
            <div className="resume-preview-container">
              <iframe
                src={previewUrl}
                title="Resume Preview"
                className="resume-preview-frame"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
