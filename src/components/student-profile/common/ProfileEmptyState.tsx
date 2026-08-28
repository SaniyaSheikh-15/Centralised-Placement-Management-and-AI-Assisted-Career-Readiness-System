import { Button } from '@/components/ui/button';

interface ProfileEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ProfileEmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: ProfileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] px-8 py-12 text-center animate-fade-in">
      <div className="mb-4 text-5xl opacity-50">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
