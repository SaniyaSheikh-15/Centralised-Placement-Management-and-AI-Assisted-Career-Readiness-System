import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ProfileErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ProfileErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ProfileErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-8 py-12 text-center animate-fade-in">
      <AlertTriangle className="mb-4 h-12 w-12 text-[var(--color-warning)]" />
      <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)]">Error Loading Data</h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--text-muted)]">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>Retry</Button>
      )}
    </div>
  );
}
