export function SkeletonLine({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return (
    <div
      className="rounded bg-card-border/40 animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-card-border bg-card p-6 animate-pulse ${className}`}>
      <SkeletonLine width="60%" height="1.25rem" />
      <div className="mt-4 space-y-3">
        <SkeletonLine width="100%" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="70%" />
      </div>
    </div>
  );
}

export function SkeletonCircle({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-card-border/40 animate-pulse"
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonChatBubble({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`rounded-2xl bg-card border border-card-border p-4 animate-pulse ${
          isUser ? 'max-w-[70%]' : 'max-w-[80%]'
        }`}
      >
        <SkeletonLine width="200px" height="0.75rem" />
        <div className="mt-2 space-y-2">
          <SkeletonLine width="280px" />
          <SkeletonLine width="220px" />
        </div>
      </div>
    </div>
  );
}
