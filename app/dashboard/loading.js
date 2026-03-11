export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <header className="mb-10">
        <div className="h-9 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="mt-2 h-4 w-48 rounded-lg bg-zinc-100 dark:bg-zinc-900"></div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900"></div>
              <div className="h-4 w-10 rounded bg-zinc-100 dark:bg-zinc-900"></div>
            </div>
            <div className="h-4 w-24 rounded bg-zinc-100 dark:bg-zinc-900"></div>
            <div className="mt-2 h-8 w-16 rounded bg-zinc-100 dark:bg-zinc-900"></div>
          </div>
        ))}
      </div>

      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 h-7 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="grid gap-4">
            <div className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900"></div>
            <div className="h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-900"></div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-6 h-7 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-900"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-900"></div>
                  <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
