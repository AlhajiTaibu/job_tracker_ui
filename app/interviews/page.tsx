import InterviewsClient from "./interview-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import {
  getInterviewsHistoryQueryOptions,
  getUpcomingInterviewsQueryOptions,
} from "@/hooks/use-interview";
import { GeneralSkeleton } from "@/components/general-skeleton";

// const getInterviews = async (endpoint: string) => {
//   const cookieStore = await cookies();
//   const baseUrl =
//     typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
//   const res = await fetch(`${baseUrl}/api/interviews/${endpoint}`, {
//     headers: {
//       cookie: cookieStore.toString(),
//     },
//     next: { revalidate: 60 },
//   });

//   if (!res.ok) {
//     throw new Error("Interviews fetch failed");
//   }
//   return res.json();
// };

export default async function InterviewsPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await Promise.all([
    queryClient.prefetchQuery(
      getUpcomingInterviewsQueryOptions({ cookieStore }),
    ),
    queryClient.prefetchInfiniteQuery(
      getInterviewsHistoryQueryOptions({ cookieStore }),
    ),
  ]);

  return (
    <Suspense fallback={<GeneralSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InterviewsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
