import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Props = {
  scheduled?: number;
  completed?: number;
  passed?: number;
};

export function InterviewAnalyticsSection({
  scheduled = 0,
  completed = 0,
  passed = 0,
}: Props) {
  const completionRate = scheduled
    ? Math.round((completed / scheduled) * 100)
    : 0;
  const passRate = completed ? Math.round((passed / completed) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Analytics</CardTitle>
        <CardDescription>Interview progress and outcomes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="text-xs text-blue-700 dark:text-blue-400">
              Scheduled
            </div>
            <div className="text-lg font-semibold">{scheduled}</div>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3 dark:border-violet-900 dark:bg-violet-950/20">
            <div className="text-xs text-violet-700 dark:text-violet-400">
              Completed
            </div>
            <div className="text-lg font-semibold">{completed}</div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">
              Passed
            </div>
            <div className="text-lg font-semibold">{passed}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Completion Rate</div>
            <div className="text-lg font-semibold">{completionRate}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Pass Rate</div>
            <div className="text-lg font-semibold">{passRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
