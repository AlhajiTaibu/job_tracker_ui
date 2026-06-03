import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Suspense } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>;
}
