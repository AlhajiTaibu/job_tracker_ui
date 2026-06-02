import { Suspense } from "react";
import TasksClient from "./tasks-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { TaskResponse } from "@/lib/types";

const getTasks = async (endpoint: string): Promise<TaskResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/task/${endpoint}`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Profile fetch failed");
  }
  return res.json();
};

export default async function TasksPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["upcoming-tasks"],
      queryFn: () => getTasks("upcoming-tasks"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["overdue-tasks"],
      queryFn: () => getTasks("overdue-tasks"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["daily-tasks"],
      queryFn: () => getTasks("daily-tasks"),
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    }),
  ]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TasksClient />
      </HydrationBoundary>
    </Suspense>
  );
}
