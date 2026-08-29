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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1A2B42] bg-[#0E1B2E] px-8 py-12 text-center animate-fade-in">
      <div className="mb-4 text-5xl opacity-50">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-[#F1F5F9]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[#64748B]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0D6FE0]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
