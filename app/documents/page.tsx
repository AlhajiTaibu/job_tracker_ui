import { DocumentManager } from "./document-manager";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getDocumentsQueryOptions } from "@/hooks/use-documents";

export default async function DocumentsPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getDocumentsQueryOptions({
      filters: {},
      search: "",
      limit: 20,
      cookieStore,
    }),
  );
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DocumentManager />
      </HydrationBoundary>
    </Suspense>
  );
}
