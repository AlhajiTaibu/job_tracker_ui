import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  MessageCircleMore,
  Trophy,
} from "lucide-react";

const insights = [
  {
    title: "Interview pass rate",
    value: "57%",
    note: "Strong conversion through interviews",
    tone: "success",
    icon: CheckCircle2,
  },
  {
    title: "Top source",
    value: "LinkedIn",
    note: "3 applications submitted",
    tone: "primary",
    icon: Trophy,
  },
  {
    title: "Needs attention",
    value: "1 stale application",
    note: "No recent activity detected",
    tone: "warning",
    icon: AlertTriangle,
  },
  {
    title: "Follow-up response rate",
    value: "50%",
    note: "Room to improve candidate engagement",
    tone: "neutral",
    icon: MessageCircleMore,
  },
];

const toneStyles = {
  success: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    iconWrap: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
  },
  primary: {
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    iconWrap: "bg-blue-100 text-blue-600",
    value: "text-blue-700",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    iconWrap: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    iconWrap: "bg-slate-200 text-slate-600",
    value: "text-slate-800",
  },
};

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Insights</h3>
          <p className="mt-1 text-sm text-slate-500">
            Key takeaways from your pipeline data
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
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
              className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2.5 ${styles.iconWrap}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-600">
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
                  <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
