import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import ContactsClient from "./contact-client";
import { ContactResponse } from "@/lib/types";

const getContacts = async (): Promise<ContactResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
  const res = await fetch(`${baseUrl}/api/contacts/list`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Contact fetch failed");
  }
  return res.json();
};

export default async function ContactsPage() {
  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactsClient />
    </HydrationBoundary>
  );
}
