import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ApplicationsClient from "./applications-client";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { getJobsQueryOptions } from "@/hooks/use-jobs";

// const getJobs = async (): Promise<JobApplicationResponse> => {
//   const cookieStore = await cookies();
//   const baseUrl =
//     typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
//   const res = await fetch(`${baseUrl}/api/applications/list`, {
//     headers: {
//       cookie: cookieStore.toString(),
//     },
//     next: { revalidate: 60 },
//   });

//   if (!res.ok) {
//     throw new Error("Job fetch failed");
//   }
//   return res.json();
// };

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchInfiniteQuery(
    getJobsQueryOptions({
      cookieStore,
    }),
  );

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ApplicationsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
