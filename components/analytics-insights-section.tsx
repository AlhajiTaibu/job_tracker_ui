import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Props = {
  items: string[];
};

export function AnalyticsInsightsSection({ items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
        <CardDescription>Key takeaways from your pipeline data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border p-3 text-sm">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
