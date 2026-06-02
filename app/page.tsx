import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import DashboardClient from "./dashboard-client";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { JobApplication, JobApplicationResponse } from "@/lib/types";
import { cookies } from "next/headers";

const getJobs = async (): Promise<JobApplicationResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/applications/list`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Job fetch failed");
  }
  return res.json();
};

export default async function DashboardPage({
  search = "",
  filters = {},
  limit = 20,
}: {
  search?: string;
  filters?: Record<string, string | number | boolean | undefined>;
  limit?: number;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["jobs", { search, filters, limit }],
    queryFn: ({ pageParam = null }) => getJobs(),
    initialPageParam: null,
    getNextPageParam: (lastPage: any) =>
      lastPage?.payload?.next_cursor ?? undefined,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardClient />
      </HydrationBoundary>
    </Suspense>
  );
}
