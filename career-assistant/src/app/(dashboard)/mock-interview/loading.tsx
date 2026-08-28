import { SkeletonCard } from '@/components/member6/shared/Skeleton';

export default function MockInterviewLoading() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard className="h-[500px]" />
        </div>
        <div className="lg:col-span-3">
          <SkeletonCard className="h-[500px]" />
        </div>
      </div>
    </div>
  );
}
