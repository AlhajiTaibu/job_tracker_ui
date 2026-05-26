import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Activity,
  MessageSquare,
  Timer,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  totalApplications?: number;
  interviewRate?: string;
  followUpRate?: string;
  avgTimeInStage?: string;
  healthScore?: string;
};

const items = (data: Props) => [
  {
    title: "Total Applications",
    value: data.totalApplications ?? 0,
    icon: Briefcase,
    iconClass:
      "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    borderClass: "border-l-blue-500",
  },
  {
    title: "Interview Rate",
    value: data.interviewRate ?? "0%",
    icon: Activity,
    iconClass:
      "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400",
    borderClass: "border-l-violet-500",
  },
  {
    title: "Follow-up Rate",
    value: data.followUpRate ?? "0%",
    icon: MessageSquare,
    iconClass:
      "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
    borderClass: "border-l-cyan-500",
  },
  {
    title: "Avg Time in Stage",
    value: data.avgTimeInStage ?? "0d",
    icon: Timer,
    iconClass:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    borderClass: "border-l-amber-500",
  },
  {
    title: "Health Score",
    value: data.healthScore ?? "0%",
    icon: HeartPulse,
    iconClass:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
    borderClass: "border-l-emerald-500",
  },
];

export function AnalyticsOverviewCards(props: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items(props).map((item) => (
        <Card key={item.title} className={cn("border-l-4", item.borderClass)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className={cn("rounded-md p-2", item.iconClass)}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
