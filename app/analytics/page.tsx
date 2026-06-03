import AnalyticsClient from "./analytics-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Suspense } from "react";

const getAnalytics = async (endpoint: string) => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/analytics/${endpoint}`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Source Analytics fetch failed");
  }
  return res.json();
};

export default async function AnalyticsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["analytics"],
      queryFn: () => getAnalytics("application-funnel"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["pipeline-health"],
      queryFn: () => getAnalytics("pipeline-health"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["weekly-activity"],
      queryFn: () => getAnalytics("weekly-activity"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["time-in-stage"],
      queryFn: () => getAnalytics("time-in-stage"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["source-analytics"],
      queryFn: () => getAnalytics("source-analytics"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["role-analytics"],
      queryFn: () => getAnalytics("role-analytics"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["interview-analytics"],
      queryFn: () => getAnalytics("interview-analytics"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["follow-up-analytics"],
      queryFn: () => getAnalytics("follow-up-analytics"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AnalyticsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
