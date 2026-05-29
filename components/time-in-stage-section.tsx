import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stage = {
  name: string;
  days: number;
};

type Props = {
  data?: Stage[];
};

export function TimeInStageSection({ data = [] }: Props) {
  const sortedData = [...data].sort((a, b) => b.days - a.days);
  const max = Math.max(...sortedData.map((d) => d.days), 1);
  const hasMeaningfulData = sortedData.some((d) => d.days > 0);

  const formatDays = (days: number) => `${Math.round(days)}d avg`;

  const getBarColor = (days: number) => {
    if (days > 14) return "bg-red-500";
    if (days > 7) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time in Stage</CardTitle>
        <CardDescription>
          Average time between application stages
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasMeaningfulData ? (
          <div className="text-sm text-muted-foreground">
            No meaningful time-in-stage data available.
          </div>
        ) : (
          sortedData.map((stage) => {
            const width = max > 0 ? (stage.days / max) * 100 : 0;
            const isBottleneck = stage.days === max;

            return (
              <div key={stage.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{stage.name}</span>
                    {isBottleneck && (
                      <span className="text-xs font-medium text-red-600">
                        Bottleneck
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground">
                    {formatDays(stage.days)}
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    role="progressbar"
                    aria-valuenow={stage.days}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={`${stage.name}: ${formatDays(stage.days)}`}
                    className={`h-2.5 rounded-full transition-all ${getBarColor(
                      stage.days,
                    )}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
