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
  const res = await fetch(`${baseUrl}/api/tasks/${endpoint}`, {
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error("Profile fetch failed");
  }
  return res.json();
};

export default async function TasksPage({
  filters = {},
}: {
  filters?: Record<string, string | number | boolean | undefined>;
}) {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["upcoming-tasks", { filters }],
      queryFn: () => getTasks("upcoming-tasks"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["overdue-tasks", { filters }],
      queryFn: () => getTasks("overdue-tasks"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["daily-tasks", { filters }],
      queryFn: () => getTasks("daily-tasks"),
    }),
  ]);
  //   queryClient.prefetchQuery({
  //     queryKey: ["upcoming-tasks", { filters }],
  //     queryFn: () => getTasks("upcoming-tasks"),
  //     staleTime: Infinity,
  //     gcTime: 10 * 60 * 1000,
  //   }),
  //   queryClient.prefetchQuery({
  //     queryKey: ["overdue-tasks", { filters }],
  //     queryFn: () => getTasks("overdue-tasks"),
  //     staleTime: Infinity,
  //     gcTime: 10 * 60 * 1000,
  //   }),
  //   queryClient.prefetchQuery({
  //     queryKey: ["daily-tasks", { filters }],
  //     queryFn: () => getTasks("daily-tasks"),
  //     staleTime: Infinity,
  //     gcTime: 10 * 60 * 1000,
  //   }),
  // ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksClient />
    </HydrationBoundary>
  );
}
