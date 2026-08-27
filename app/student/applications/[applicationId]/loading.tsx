export default function LoadingApplicationDetails() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-6">
        <div className="h-4 w-44 skeleton rounded-full" />
        <div className="mt-4 h-10 w-2/3 skeleton rounded-2xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-40 skeleton rounded-3xl" />
          </div>
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="space-y-4">
              <div className="h-20 skeleton rounded-2xl" />
              <div className="h-20 skeleton rounded-2xl" />
              <div className="h-20 skeleton rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5">
            <div className="h-32 skeleton rounded-3xl" />
          </div>
          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-5">
            <div className="h-20 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
