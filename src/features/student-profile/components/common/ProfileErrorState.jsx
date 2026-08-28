/**
 * ProfileErrorState
 * Inline error block with clear error message and "Retry" action CTA.
 */

export default function ProfileErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon">⚠️</div>
      <h3 className="error-state-title">Error Loading Data</h3>
      <p className="error-state-desc">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
