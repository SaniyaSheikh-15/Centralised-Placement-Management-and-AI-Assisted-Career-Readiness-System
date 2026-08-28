import { Skeleton } from '@/components/ui/skeleton';

interface ProfileSkeletonLoaderProps {
  variant?: 'overview' | 'cards' | 'list' | 'form';
}

export default function ProfileSkeletonLoader({ variant = 'overview' }: ProfileSkeletonLoaderProps) {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6">
            <Skeleton className="mb-4 h-5 w-3/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-2/3" />
            <Skeleton className="mt-4 h-3 w-1/3" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-[30%]" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: overview skeleton
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-6 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-8">
        <Skeleton className="h-[88px] w-[88px] rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-3 h-6 w-1/3" />
          <Skeleton className="mb-2 h-4 w-2/5" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
