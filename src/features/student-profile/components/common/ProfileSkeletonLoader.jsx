/**
 * ProfileSkeletonLoader
 * Layout-matching placeholder blocks with pulse animation.
 * Renders different skeleton layouts based on the `variant` prop.
 */

export default function ProfileSkeletonLoader({ variant = 'overview' }) {
  if (variant === 'cards') {
    return (
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text-sm" style={{ marginTop: 'var(--space-4)' }} />
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <div className="skeleton skeleton-button" />
              <div className="skeleton skeleton-button" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text-sm" />
            </div>
            <div className="skeleton skeleton-button" style={{ width: 80 }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-lg)' }} />
        <div className="grid-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="form-group">
              <div className="skeleton skeleton-text-sm" style={{ width: '30%' }} />
              <div className="skeleton" style={{ height: 38, borderRadius: 'var(--radius-md)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: overview skeleton
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header skeleton */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-8)' }}>
        <div className="skeleton skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          <div className="skeleton skeleton-text-sm" style={{ width: '25%' }} />
        </div>
        <div className="skeleton skeleton-button" />
      </div>

      {/* Cards skeleton */}
      <div className="grid-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  );
}
