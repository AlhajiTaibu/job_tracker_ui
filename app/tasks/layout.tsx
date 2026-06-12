import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { GeneralSkeleton } from "@/components/general-skeleton";
import { Suspense } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<GeneralSkeleton />}>{children}</Suspense>;
}
