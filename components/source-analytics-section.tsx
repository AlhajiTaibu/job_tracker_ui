import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SourceAnalyticsResponse, SourceDetails } from "@/lib/types";

type Props = {
  data?: SourceAnalyticsResponse;
};

const stages = [
  { key: "applied_count", label: "Applied", color: "bg-blue-500" },
  { key: "screened_count", label: "Screened", color: "bg-amber-500" },
  { key: "interviewed_count", label: "Interview", color: "bg-violet-500" },
  { key: "offers_count", label: "Offers", color: "bg-emerald-500" },
  { key: "accepted_count", label: "Accepted", color: "bg-green-600" },
] as const satisfies ReadonlyArray<{
  key: keyof SourceDetails;
  label: string;
  color: string;
}>;

export function SourceAnalyticsSection({ data = {} }: Props) {
  const entries = Object.entries(data).sort(([, a], [, b]) => {
    const scoreA =
      a.applied_count +
      a.screened_count +
      a.interviewed_count +
      a.offers_count * 2 +
      a.accepted_count * 3;

    const scoreB =
      b.applied_count +
      b.screened_count +
      b.interviewed_count +
      b.offers_count * 2 +
      b.accepted_count * 3;

    return scoreB - scoreA;
  });

  const totalApplied = entries.reduce(
    (sum, [, item]) => sum + item.applied_count,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Analytics</CardTitle>
        <CardDescription>
          Application volume and funnel performance by source
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No source data available.
          </div>
        ) : (
          entries.map(([source, item], index) => {
            const appliedShare = totalApplied
              ? Math.round((item.applied_count / totalApplied) * 100)
              : 0;

            const maxStageCount = Math.max(
              item.applied_count,
              item.screened_count,
              item.interviewed_count,
              item.offers_count,
              item.accepted_count,
              1,
            );

            return (
              <div key={source} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      {index === 0 ? "🏆 " : ""}
                      {source}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.applied_count} applied • {appliedShare}% of total
                    </div>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    <div>Responses: {item.response_count}</div>
                    <div>Response rate: {item.response_rate}%</div>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${appliedShare}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {stages.map((stage) => {
                    const value = item[stage.key] as number;
                    const width = Math.round((value / maxStageCount) * 100);

                    return (
                      <div
                        key={stage.key}
                        className="space-y-2 rounded-md bg-muted/40 p-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`h-2 w-2 rounded-full ${stage.color}`}
                          />
                          <span className="text-muted-foreground">
                            {stage.label}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>

                        <div className="h-1.5 rounded-full bg-muted">
                          <div
                            className={`h-1.5 rounded-full ${stage.color}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground md:grid-cols-4">
                  <div>Apply → Screen: {item.applied_to_screening_rate}%</div>
                  <div>
                    Screen → Interview: {item.screening_to_interview_rate}%
                  </div>
                  <div>
                    Interview → Offer: {item.interviewed_to_offer_rate}%
                  </div>
                  <div>Offer → Accepted: {item.offer_to_accepted_rate}%</div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
