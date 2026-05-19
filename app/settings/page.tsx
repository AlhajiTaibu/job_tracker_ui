import SettingsClient from "./settings-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { cookies } from "next/headers";
import { ProfileResponse } from "@/lib/types";

const getProfile = async (): Promise<ProfileResponse> => {
  const cookieStore = await cookies();
  const baseUrl =
    typeof window !== "undefined"
      ? ""
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/me/get`, {
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!res.ok) {
    throw new Error("Profile fetch failed");
  }
  return res.json();
};

export default async function SettingsPage() {
  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsClient />
    </HydrationBoundary>
  );
}
