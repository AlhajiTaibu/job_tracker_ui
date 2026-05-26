import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type FunnelStage = {
  name: string;
  count: number;
  percentage?: number;
};

type Props = {
  data?: FunnelStage[];
  className?: string;
};

const stageColors: Record<string, string> = {
  Applied: "bg-blue-500",
  Screening: "bg-cyan-500",
  Interview: "bg-violet-500",
  Offer: "bg-emerald-500",
};

export function ApplicationFunnelSection({ data = [], className }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
        <CardDescription>Track conversion across hiring stages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No funnel data available.
          </div>
        ) : (
          data.map((stage) => (
            <div key={stage.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <span className="text-muted-foreground">
                  {stage.count}
                  {stage.percentage !== undefined
                    ? ` • ${stage.percentage}%`
                    : ""}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted">
                <div
                  className={`h-2.5 rounded-full ${stageColors[stage.name] ?? "bg-primary"}`}
                  style={{ width: `${(stage.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
