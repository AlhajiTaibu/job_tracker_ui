import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  MessageCircleMore,
  Trophy,
} from "lucide-react";

const toneStyles = {
  success: {
    badge:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    iconWrap: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    value: "text-emerald-700 dark:text-emerald-300",
  },
  primary: {
    badge:
      "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20 dark:text-blue-300",
    iconWrap: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    value: "text-blue-700 dark:text-blue-300",
  },
  warning: {
    badge:
      "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300",
    iconWrap: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    value: "text-amber-700 dark:text-amber-300",
  },
  neutral: {
    badge: "bg-muted text-muted-foreground ring-1 ring-border",
    iconWrap: "bg-muted text-muted-foreground",
    value: "text-foreground",
  },
} as const;

type InsightItem = {
  title: string;
  value: string;
  note: string;
  tone: "success" | "primary" | "warning" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
};

type AnalyticsInsightsSectionProps = {
  items: InsightItem[];
};

export function AnalyticsInsightsSection({
  items,
}: AnalyticsInsightsSectionProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Insights</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Key takeaways from your pipeline data
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Live summary
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const styles = toneStyles[item.tone];

          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-border bg-card p-4 transition hover:bg-muted/40"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2.5 ${styles.iconWrap}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}
                    >
                      {item.tone === "success" && "Healthy"}
                      {item.tone === "primary" && "Top performer"}
                      {item.tone === "warning" && "Action needed"}
                      {item.tone === "neutral" && "Monitor"}
                    </span>
                  </div>

                  <div
                    className={`text-2xl font-semibold tracking-tight ${styles.value}`}
                  >
                    {item.value}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.note}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
