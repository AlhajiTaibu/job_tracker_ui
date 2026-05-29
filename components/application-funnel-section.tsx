import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ApplicationFunnelResponse } from "@/lib/types";

export function mapApplicationFunnelToStages(
  data: ApplicationFunnelResponse,
): FunnelStage[] {
  const applied = data.count_applications_sent ?? 0;
  const screened = data.applied_to_screening?.screened_count ?? 0;
  const interviewed = data.count_completed_interviews ?? 0;
  const offers = data.count_offers_received ?? 0;
  const accepted = data.offer_to_accepted?.accepted_count ?? 0;

  return [
    {
      name: "Applied",
      count: applied,
      percentage: applied > 0 ? (applied / applied) * 100 : 0,
      subtitle: `${applied} applications sent`,
    },
    {
      name: "Screening",
      count: screened,
      percentage: applied > 0 ? (screened / applied) * 100 : 0,
      subtitle: `${screened} of ${applied} applied`,
    },
    {
      name: "Interview",
      count: interviewed,
      percentage: screened > 0 ? (interviewed / screened) * 100 : 0,
      subtitle: `${interviewed} of ${screened} screened`,
    },
    {
      name: "Offer",
      count: offers,
      percentage: interviewed > 0 ? (offers / interviewed) * 100 : 0,
      subtitle: `${offers} of ${interviewed} interviewed`,
    },
    {
      name: "Accepted",
      count: accepted,
      percentage: offers > 0 ? (accepted / offers) * 100 : 0,
      subtitle: `${accepted} of ${offers} offers`,
    },
  ];
}

export type FunnelStage = {
  name: string;
  count: number;
  percentage: number;
  subtitle?: string;
};

type ApplicationFunnelSectionProps = {
  className?: string;
  data?: FunnelStage[];
};

const stageColors: string[] = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

export function ApplicationFunnelSection({
  className,
  data = [],
}: ApplicationFunnelSectionProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No funnel data available
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((stage, index) => {
              const safePercentage = Math.max(
                0,
                Math.min(100, stage.percentage ?? 0),
              );
              const colorClass = stageColors[index % stageColors.length];

              return (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {stage.name}
                      </p>
                      {stage.subtitle ? (
                        <p className="text-xs text-muted-foreground">
                          {stage.subtitle}
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {stage.count}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {safePercentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        colorClass,
                      )}
                      style={{ width: `${safePercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
