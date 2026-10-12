import { SkeletonChatBubble } from '@/components/member6/shared/Skeleton';

export default function CareerAssistantLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl border border-card-border bg-bg-secondary overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-card-border bg-card animate-pulse">
        <div className="w-9 h-9 rounded-xl bg-card-border/40" />
        <div className="space-y-1.5">
          <div className="w-32 h-4 rounded bg-card-border/40" />
          <div className="w-24 h-3 rounded bg-card-border/40" />
        </div>
      </div>
      {/* Banner skeleton */}
      <div className="h-10 bg-bg-secondary border-b border-card-border animate-pulse" />
      {/* Messages skeleton */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <SkeletonChatBubble />
          <SkeletonChatBubble isUser />
          <SkeletonChatBubble />
        </div>
      </div>
      {/* Input skeleton */}
      <div className="border-t border-card-border bg-bg-secondary p-4 animate-pulse">
        <div className="max-w-4xl mx-auto h-12 rounded-xl bg-card border border-card-border" />
      </div>
    </div>
  );
}
