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
import { useAnalyticsDashboard } from "@/hooks/use-analytics-dashboard";

export default function AnalyticsClient() {
  const {
    jobs,
    applicationFunnelStages,
    pipelineMetrics,
    weeklyActivity,
    timeInStageChartData,
    avgTimeInStage,
    sourceAnalytics,
    roleData,
    interviewAnalytics,
    followUpAnalytics,
    interviewRate,
    insightItems,
    isLoading,
    error,
  } = useAnalyticsDashboard();

  const [mobileOpen, setMobileOpen] = useState(false);

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load analytics.
      </div>
    );
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
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
            interviewRate={`${interviewRate}%`}
            followUpRate={`${followUpAnalytics?.followed_up_job_response_rate ?? 0}%`}
            avgTimeInStage={`${avgTimeInStage}d`}
            healthScore={`${pipelineMetrics.score}%`}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <ApplicationFunnelSection
              className="xl:col-span-2"
              data={applicationFunnelStages}
            />
            <PipelineHealthSection
              score={pipelineMetrics.score}
              staleApplications={pipelineMetrics.staleApplications}
              activePipelinePercent={pipelineMetrics.activePipelinePercent}
              overdueTasks={pipelineMetrics.overdueTasks}
              upcomingTasks={pipelineMetrics.upcomingTasks}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <WeeklyActivitySection
              data={weeklyActivity.length ? weeklyActivity : []}
            />
            <TimeInStageSection data={timeInStageChartData} />
            <AnalyticsInsightsSection items={insightItems} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SourceAnalyticsSection data={sourceAnalytics} />
            <RoleAnalyticsSection data={roleData} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <InterviewAnalyticsSection
              first_round_interview={interviewAnalytics?.first_round_interview}
              second_round_interview={
                interviewAnalytics?.second_round_interview
              }
              third_round_interview={interviewAnalytics?.third_round_interview}
            />

            <FollowUpAnalyticsSection
              followedUpJobResponseRate={
                followUpAnalytics?.followed_up_job_response_rate ?? 0
              }
              unfollowedUpJobResponseRate={
                followUpAnalytics?.unfollowed_up_job_response_rate ?? 0
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}
