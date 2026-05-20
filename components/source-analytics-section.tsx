import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Item = {
  name: string;
  count: number;
};

type Props = {
  data?: Item[];
};

export function SourceAnalyticsSection({ data = [] }: Props) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Analytics</CardTitle>
        <CardDescription>Applications by source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No source data available.
          </div>
        ) : (
          data.map((item, index) => {
            const percent = total ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.name} className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {index === 0 ? "🏆 " : ""}
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {item.count} • {percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${percent}%` }}
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
