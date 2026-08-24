export default function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#050B14] p-4 sm:p-6 lg:p-8">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-xl rounded-xl border border-[#1E3045] bg-[#101C2C] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1E3045] bg-[#0B1422]">
            <span className="text-xl text-[#1683FF]">•</span>
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-[#F8FAFC]">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
            {description}
          </p>

          <span className="mt-6 inline-flex rounded-lg border border-[#1E3045] bg-[#0B1422] px-4 py-2 text-xs text-[#64748B]">
            Module integration pending
          </span>
        </div>
      </div>
    </main>
  );
}