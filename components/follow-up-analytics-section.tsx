import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Props = {
  sent?: number;
  responses?: number;
  conversions?: number;
};

export function FollowUpAnalyticsSection({
  sent = 0,
  responses = 0,
  conversions = 0,
}: Props) {
  const responseRate = sent ? Math.round((responses / sent) * 100) : 0;
  const conversionRate = sent ? Math.round((conversions / sent) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Analytics</CardTitle>
        <CardDescription>
          Follow-up effectiveness and conversions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="text-xs text-blue-700 dark:text-blue-400">Sent</div>
            <div className="text-lg font-semibold">{sent}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="text-xs text-amber-700 dark:text-amber-400">
              Responses
            </div>
            <div className="text-lg font-semibold">{responses}</div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">
              Conversions
            </div>
            <div className="text-lg font-semibold">{conversions}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Response Rate</div>
            <div className="text-lg font-semibold">{responseRate}%</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Conversion Rate</div>
            <div className="text-lg font-semibold">{conversionRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
