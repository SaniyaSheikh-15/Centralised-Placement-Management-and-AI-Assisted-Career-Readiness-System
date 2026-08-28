import ResumeUploader from '../resume/ResumeUploader';

/**
 * TabResume — Edit Tab 9
 * Embedded standalone Resume Upload component.
 */

export default function TabResume() {
  return (
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
        Upload your latest resume as a PDF file (max 5 MB).
      </p>
      <ResumeUploader />
    </div>
  );
}
