import { Suspense } from "react";
import TasksClient from "./tasks-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";

export default function TasksPage() {
  const queryClient = getQueryClient();
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TasksClient />
      </HydrationBoundary>
    </Suspense>
  );
}
