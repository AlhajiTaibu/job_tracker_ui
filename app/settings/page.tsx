import SettingsClient from "./settings-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { ProfileResponse } from "@/lib/types";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

const getProfile = async (): Promise<ProfileResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/me/get`, {
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

export default async function SettingsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
