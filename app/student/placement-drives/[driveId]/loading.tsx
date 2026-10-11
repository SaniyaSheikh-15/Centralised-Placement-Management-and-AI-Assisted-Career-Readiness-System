export default function LoadingDriveDetails() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-6">
        <div className="h-4 w-40 skeleton rounded-full" />
        <div className="mt-4 h-10 w-2/3 skeleton rounded-2xl" />
        <div className="mt-3 h-5 w-1/2 skeleton rounded-full" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-8 w-1/3 skeleton rounded-full" />
            <div className="mt-4 h-24 skeleton rounded-2xl" />
          </div>
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-8 w-1/3 skeleton rounded-full" />
            <div className="mt-4 grid gap-3">
              <div className="h-20 skeleton rounded-2xl" />
              <div className="h-20 skeleton rounded-2xl" />
              <div className="h-20 skeleton rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-8 w-1/3 skeleton rounded-full" />
            <div className="mt-4 h-24 skeleton rounded-2xl" />
          </div>
          <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-8 w-1/3 skeleton rounded-full" />
            <div className="mt-4 h-28 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
