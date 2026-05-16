import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  const columns = ["Saved", "Applied", "Screening", "Assessment", "Interview"];

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-64 border-r bg-card md:flex md:flex-col">
        <div className="flex items-center gap-3 p-6">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-6 w-28" />
        </div>

        <div className="space-y-3 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-3 py-3"
            >
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border p-4 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <div className="border-b px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-10 w-40 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid h-[calc(100vh-89px)] grid-cols-1 gap-4 overflow-x-auto p-6 md:grid-cols-3 xl:grid-cols-5">
          {columns.map((column, index) => (
            <div key={column} className="flex min-w-[260px] flex-col">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-6 rounded-full" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>

              <div className="flex-1 rounded-2xl bg-muted/40 p-3 space-y-3">
                {index === 0 ? (
                  <>
                    <JobCardSkeleton />
                    <JobCardSkeleton />
                  </>
                ) : (
                  <>
                    <JobCardSkeleton />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <Skeleton className="h-4 w-20" />

      <div className="pt-2 border-t">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
