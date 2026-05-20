import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Stage = {
  name: string;
  days: number;
};

type Props = {
  data?: Stage[];
};

export function TimeInStageSection({ data = [] }: Props) {
  const max = Math.max(...data.map((d) => d.days), 1);

  const getBarColor = (days: number) => {
    if (days >= max) return "bg-red-500";
    if (days >= max * 0.6) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time in Stage</CardTitle>
        <CardDescription>Identify process bottlenecks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No time-in-stage data available.
          </div>
        ) : (
          data.map((stage) => (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{stage.name}</span>
                <span className="text-muted-foreground">{stage.days}d</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div
                  className={`h-2.5 rounded-full ${getBarColor(stage.days)}`}
                  style={{ width: `${(stage.days / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
