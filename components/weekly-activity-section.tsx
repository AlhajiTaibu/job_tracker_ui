import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Point = {
  label: string;
  value: number;
};

type Props = {
  data?: Point[];
};

export function WeeklyActivitySection({ data = [] }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Application Activity</CardTitle>
        <CardDescription>Application volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No activity data available.
          </div>
        ) : (
          <div className="flex h-56 items-end gap-3">
            {data.map((item) => (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-primary"
                  style={{
                    height: `${Math.max((item.value / max) * 100, 8)}%`,
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
