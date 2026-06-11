import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import ContactsClient from "./contact-client";
import { getContactsQueryOptions } from "@/hooks/use-contact";
import { GeneralSkeleton } from "@/components/general-skeleton";

export default async function ContactsPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchInfiniteQuery(
    getContactsQueryOptions({
      search: "",
      limit: 20,
      cookieStore: cookieStore,
    }),
  );

  return (
    <Suspense fallback={<GeneralSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ContactsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
