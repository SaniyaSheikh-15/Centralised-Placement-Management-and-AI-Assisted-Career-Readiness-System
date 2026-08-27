export default function LoadingEligibility() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-6">
        <div className="h-4 w-44 skeleton rounded-full" />
        <div className="mt-4 h-10 w-3/4 skeleton rounded-2xl" />
      </div>
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="h-80 skeleton rounded-3xl" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 skeleton rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
