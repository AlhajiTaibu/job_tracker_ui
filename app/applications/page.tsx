import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ApplicationsClient from "./applications-client";
import { Suspense } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { getJobsQueryOptions } from "@/hooks/use-jobs";
import { GeneralSkeleton } from "@/components/general-skeleton";

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchInfiniteQuery(
    getJobsQueryOptions({
      cookieStore,
    }),
  );

  return (
    <Suspense fallback={<GeneralSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ApplicationsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
