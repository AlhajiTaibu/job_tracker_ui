import SettingsClient from "./settings-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getProfileQueryOptions } from "@/hooks/use-profile";

export default async function SettingsPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(getProfileQueryOptions(cookieStore));

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
