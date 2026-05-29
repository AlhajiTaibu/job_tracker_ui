import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  score?: number;
  staleApplications?: number;
  activePipelinePercent?: number;
  overdueTasks?: number;
  upcomingTasks?: number;
};

export function PipelineHealthSection({
  score = 0,
  staleApplications = 0,
  activePipelinePercent = 0,
  overdueTasks = 0,
  upcomingTasks = 0,
}: Props) {
  const scoreColor =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  const badgeClass =
    score >= 75
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 50
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";

  const status =
    score >= 75 ? "Healthy" : score >= 50 ? "Needs Attention" : "Critical";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pipeline Health</CardTitle>
            <CardDescription>
              Monitor stale applications, overdure Tasks and upcoming tasks
            </CardDescription>
          </div>
          <div
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium",
              badgeClass,
            )}
          >
            {status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 text-sm text-muted-foreground">Health Score</div>
          <div className="h-3 rounded-full bg-muted">
            <div
              className={cn("h-3 rounded-full", scoreColor)}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-2xl font-bold">{score}%</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Biggest risk: {staleApplications} stale applications
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="text-xs text-amber-700 dark:text-amber-400">
              Stale Applications
            </div>
            <div className="text-lg font-semibold">{staleApplications}</div>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="text-xs text-blue-700 dark:text-blue-400">
              Active Pipeline
            </div>
            <div className="text-lg font-semibold">
              {activePipelinePercent}%
            </div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50/60 p-3 dark:border-red-900 dark:bg-red-950/20">
            <div className="text-xs text-red-700 dark:text-red-400">
              Overdue Tasks
            </div>
            <div className="text-lg font-semibold">{overdueTasks}</div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">
              Upcoming Tasks
            </div>
            <div className="text-lg font-semibold">{upcomingTasks}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
