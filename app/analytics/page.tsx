"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { AnalyticsOverviewCards } from "@/components/analytics-overview-cards";
import { ApplicationFunnelSection } from "@/components/application-funnel-section";
import { PipelineHealthSection } from "@/components/pipeline-health-section";
import { WeeklyActivitySection } from "@/components/weekly-activity-section";
import { TimeInStageSection } from "@/components/time-in-stage-section";
import { SourceAnalyticsSection } from "@/components/source-analytics-section";
import { RoleAnalyticsSection } from "@/components/role-analytics-section";
import { InterviewAnalyticsSection } from "@/components/interview-analytics-section";
import { FollowUpAnalyticsSection } from "@/components/follow-up-analytics-section";
import { AnalyticsInsightsSection } from "@/components/analytics-insights-section";
import { useState } from "react";
import { Hamburger } from "@/components/ui/hamburger";
import { useJobs } from "@/hooks/use-jobs";

export default function AnalyticsPage() {
  const {
    data: jobsData,
    isPending,
    isFetching,
  } = useJobs({
    search: "",
    filters: {},
    limit: 20,
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        totalJobs={jobs.length}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Analytics
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Funnel, activity, sourcing, interviews, follow-ups, and pipeline
                health
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-6">
          <AnalyticsOverviewCards
            totalApplications={jobs.length}
            interviewRate="24%"
            followUpRate="41%"
            avgTimeInStage="6d"
            healthScore="78%"
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <ApplicationFunnelSection
              className="xl:col-span-2"
              data={[
                { name: "Applied", count: 120, percentage: 100 },
                { name: "Screening", count: 80, percentage: 67 },
                { name: "Interview", count: 36, percentage: 30 },
                { name: "Offer", count: 8, percentage: 7 },
              ]}
            />
            <PipelineHealthSection
              score={78}
              staleApplications={14}
              activePipelinePercent={64}
              overdueFollowUps={5}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <WeeklyActivitySection
              data={[
                { label: "W1", value: 12 },
                { label: "W2", value: 18 },
                { label: "W3", value: 10 },
                { label: "W4", value: 22 },
              ]}
            />
            <TimeInStageSection
              data={[
                { name: "Applied", days: 2 },
                { name: "Screening", days: 5 },
                { name: "Interview", days: 8 },
                { name: "Offer", days: 3 },
              ]}
            />
            <AnalyticsInsightsSection
              items={[
                "Interview is the slowest stage at 8d average",
                "LinkedIn is the top source with 42 applications.",
                "14 stale applications need attention",
                "Follow-up response rate is 36%",
              ]}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SourceAnalyticsSection
              data={[
                { name: "LinkedIn", count: 42 },
                { name: "Company Site", count: 31 },
                { name: "Referral", count: 18 },
              ]}
            />
            <RoleAnalyticsSection
              data={[
                { name: "Frontend Engineer", count: 28 },
                { name: "Product Designer", count: 16 },
                { name: "PM", count: 12 },
              ]}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <InterviewAnalyticsSection
              scheduled={14}
              completed={10}
              passed={4}
            />
            <FollowUpAnalyticsSection sent={25} responses={9} conversions={3} />
          </div>
        </main>
      </div>
    </div>
  );
}
