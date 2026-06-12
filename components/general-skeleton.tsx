import { Skeleton } from "@/components/ui/skeleton";
import { StaticAppSidebar } from "@/components/static-app-sidebar";

export function GeneralSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StaticAppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="h-9 w-9 rounded-md bg-muted md:hidden" />

          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="mt-2 h-4 w-56 rounded bg-muted" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton lines={2} />
            <CardSkeleton lines={2} />
          </div>
        </main>
      </div>
    </div>
  );
}

function CardSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="space-y-2 p-6">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-4 w-64 rounded bg-muted" />
      </div>

      <div className="space-y-4 px-6 pb-6">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}

        <div className="h-10 w-32 rounded-md bg-muted" />
      </div>
    </div>
  );
}
