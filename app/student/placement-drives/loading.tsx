export default function LoadingPlacementDrives() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-6">
        <div className="h-4 w-44 skeleton rounded-full" />
        <div className="mt-4 h-10 w-3/4 skeleton rounded-2xl" />
        <div className="mt-3 h-5 w-1/2 skeleton rounded-full" />
      </div>
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="h-14 skeleton rounded-2xl" />
          <div className="h-14 skeleton rounded-2xl" />
          <div className="h-14 skeleton rounded-2xl" />
          <div className="h-14 skeleton rounded-2xl" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
            <div className="h-5 w-1/3 skeleton rounded-full" />
            <div className="mt-3 h-8 w-2/3 skeleton rounded-full" />
            <div className="mt-4 h-24 skeleton rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
