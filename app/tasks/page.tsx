import { Suspense } from "react";
import TasksClient from "./tasks-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { TaskResponse } from "@/lib/types";
import {
  getUpcomingTasksQueryOptions,
  getOverdueTasksQueryOptions,
  getDailyTasksQueryOptions,
} from "@/hooks/use-task";

export default async function TasksPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await Promise.all([
    queryClient.prefetchQuery(getUpcomingTasksQueryOptions({}, cookieStore)),
    queryClient.prefetchQuery(getOverdueTasksQueryOptions({}, cookieStore)),
    queryClient.prefetchQuery(getDailyTasksQueryOptions({}, cookieStore)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksClient />
    </HydrationBoundary>
  );
}
