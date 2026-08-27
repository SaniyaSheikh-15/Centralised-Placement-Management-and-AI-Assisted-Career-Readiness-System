export default function LoadingApplications() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-6">
        <div className="h-4 w-44 skeleton rounded-full" />
        <div className="mt-4 h-10 w-2/3 skeleton rounded-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-28 skeleton rounded-[28px]" />
        ))}
      </div>
      <div className="rounded-[28px] border border-slate-800/80 bg-[#0b1524]/90 p-5">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
