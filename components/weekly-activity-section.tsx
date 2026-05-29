import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type Point = {
  label: string;
  value: number;
  period: string
};

type Props = {
  data?: Point[];
};

export function WeeklyActivitySection({ data = [] }: Props) {
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
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                barCategoryGap={18}
              >
                <CartesianGrid
                  stroke="hsl(var(--border))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                content={<CustomTooltip />}
                />
                <Bar
                  dataKey="value"
                  fill="rgba(34, 197, 94, 0.85)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;

  const value = payload[0]?.value;
  const point = payload[0]?.payload as Point

  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2 shadow-md">
      <div className="text-xs text-muted-foreground">{label}</div>
      {point.period && (
        <div className="text-xs text-muted-foreground">
          {point.period}
        </div>
      )}
      <div className="text-sm font-medium text-foreground">
        {value} application{Number(value) === 1 ? "" : "s"}
      </div>
    </div>
  );
}
