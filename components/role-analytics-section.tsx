// components/role-analytics-section.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type RoleAnalyticsItem = {
  name: string;
  applied: number;
  interviewed?: number;
  offers?: number;
  accepted?: number;
};

type Props = {
  data?: RoleAnalyticsItem[];
};

export function RoleAnalyticsSection({ data = [] }: Props) {
  const sortedData = [...data].sort((a, b) => b.applied - a.applied);
  const total = sortedData.reduce((sum, item) => sum + item.applied, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Analytics</CardTitle>
        <CardDescription>Applications by role</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {sortedData.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No role data available.
          </div>
        ) : (
          sortedData.map((item, index) => {
            const percent = total
              ? Math.round((item.applied / total) * 100)
              : 0;

            const interviewRate = item.applied
              ? Math.round(((item.interviewed ?? 0) / item.applied) * 100)
              : 0;

            return (
              <div key={item.name} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {index === 0 ? "🏆 " : ""}
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    {item.applied} • {percent}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-violet-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Interviews: {item.interviewed ?? 0}</span>
                  <span>Offers: {item.offers ?? 0}</span>
                  <span>Accepted: {item.accepted ?? 0}</span>
                  <span>Apply → Interview: {interviewRate}%</span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
