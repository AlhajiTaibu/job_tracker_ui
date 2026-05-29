import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Props = {
  followedUpJobResponseRate?: number;
  unfollowedUpJobResponseRate?: number;
};

export function FollowUpAnalyticsSection({
  followedUpJobResponseRate = 0,
  unfollowedUpJobResponseRate = 0,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Analytics</CardTitle>
        <CardDescription>
          Follow-up vs non-follow-up response performance
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="text-xs text-emerald-700 dark:text-emerald-400">
              Followed-up Response Rate
            </div>
            <div className="text-lg font-semibold">
              {followedUpJobResponseRate}%
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="text-xs text-amber-700 dark:text-amber-400">
              Non-followed-up Response Rate
            </div>
            <div className="text-lg font-semibold">
              {unfollowedUpJobResponseRate}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
