import InterviewsClient from "./interviews-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";

const getInterviews = async (endpoint: string) => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/interviews/${endpoint}`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Interviews fetch failed");
  }
  return res.json();
};

export default async function InterviewsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["analytics"],
      queryFn: () => getInterviews("application-funnel"),
      staleTime: 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["pipeline-health"],
      queryFn: () => getInterviews("pipeline-health"),
      staleTime: 60 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InterviewsClient />
    </HydrationBoundary>
  );
}
