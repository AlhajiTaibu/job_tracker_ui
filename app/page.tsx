import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import DashboardClient from "./dashboard-client";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { JobApplication, JobApplicationResponse } from "@/lib/types";
import { cookies } from "next/headers";

const getJobs = async (): Promise<JobApplicationResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/applications/list`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Job fetch failed");
  }
  return res.json();
};

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
