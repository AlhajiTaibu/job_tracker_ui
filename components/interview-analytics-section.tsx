import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RoundStats = {
  total_interviews?: number;
  passed?: number;
  passed_percentage?: number;
};

type Props = {
  first_round_interview?: RoundStats;
  second_round_interview?: RoundStats;
  third_round_interview?: RoundStats;
};

export function InterviewAnalyticsSection({
  first_round_interview,
  second_round_interview,
  third_round_interview,
}: Props) {
  const rounds = [
    {
      label: "First Round",
      total: first_round_interview?.total_interviews ?? 0,
      passed: first_round_interview?.passed ?? 0,
      rate: first_round_interview?.passed_percentage ?? 0,
      className:
        "border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20",
      labelClassName: "text-blue-700 dark:text-blue-400",
    },
    {
      label: "Second Round",
      total: second_round_interview?.total_interviews ?? 0,
      passed: second_round_interview?.passed ?? 0,
      rate: second_round_interview?.passed_percentage ?? 0,
      className:
        "border-violet-200 bg-violet-50/60 dark:border-violet-900 dark:bg-violet-950/20",
      labelClassName: "text-violet-700 dark:text-violet-400",
    },
    {
      label: "Third Round",
      total: third_round_interview?.total_interviews ?? 0,
      passed: third_round_interview?.passed ?? 0,
      rate: third_round_interview?.passed_percentage ?? 0,
      className:
        "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20",
      labelClassName: "text-emerald-700 dark:text-emerald-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Analytics</CardTitle>
        <CardDescription>Interview progress and outcomes</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          {rounds.map((round) => (
            <div
              key={round.label}
              className={`rounded-xl border p-4 ${round.className}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`text-sm font-semibold ${round.labelClassName}`}
                >
                  {round.label}
                </div>
                <div className="rounded-md border bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground">
                  {round.rate}%
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Total Interviews
                  </div>
                  <div className="text-3xl font-bold tracking-tight">
                    {round.total}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex min-h-[92px] flex-col rounded-lg border bg-background/80 p-3">
                    <div className="text-xs leading-5 text-muted-foreground">
                      Passed
                    </div>
                    <div className="mt-auto text-lg font-semibold leading-none">
                      {round.passed}
                    </div>
                  </div>

                  <div className="flex min-h-[92px] flex-col rounded-lg border bg-background/80 p-3">
                    <div className="text-xs leading-5 text-muted-foreground">
                      Pass Rate
                    </div>
                    <div className="mt-auto text-lg font-semibold leading-none">
                      {round.rate}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
