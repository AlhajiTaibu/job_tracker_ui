import InterviewsClient from "./interview-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { Suspense } from "react";
import {
  getInterviewsHistoryQueryOptions,
  getUpcomingInterviewsQueryOptions,
} from "@/hooks/use-interview";
import { GeneralSkeleton } from "@/components/general-skeleton";

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
