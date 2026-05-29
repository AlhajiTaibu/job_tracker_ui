"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { AnalyticsOverviewCards } from "@/components/analytics-overview-cards";
import {
  ApplicationFunnelSection,
  mapApplicationFunnelToStages,
} from "@/components/application-funnel-section";
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
import { TrendingUp, Target, AlertTriangle, MessageSquare } from "lucide-react";

import {
  useAnalytics,
  useFollowUpAnalytics,
  useInterviewAnalytics,
  usePipelineHealthAnalytics,
  useRoleAnalytics,
  useSourceAnalytics,
  useTimeInStageAnalytics,
  useWeeklyActivityAnalytics,
} from "@/hooks/use-analytics";
import {
  ApplicationFunnelResponse,
  FollowUpAnalyticsResponse,
  HealthViewAnalyticsResponse,
  InterviewAnalyticsResponse,
  RoleAnalyticsResponse,
  SourceAnalyticsResponse,
  SourceDetails,
  TimeInStageResponse,
} from "@/lib/types";
import { Point } from "@/components/weekly-activity-section";

export default function AnalyticsClient() {
  const {
    data: jobsData,
    isPending,
    isFetching,
  } = useJobs({
    search: "",
    filters: {},
    limit: 20,
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAnalytics();

  const { data: healthPipelineData } = usePipelineHealthAnalytics();

  const { data: weeklyActivityData } = useWeeklyActivityAnalytics();

  const { data: timeInStageData } = useTimeInStageAnalytics();

  const { data: sourceAnalyticsData } = useSourceAnalytics();

  const { data: roleAnalyticsData } = useRoleAnalytics();

  const { data: interviewAnalyticsData } = useInterviewAnalytics();

  const { data: followUpAnalyticsData } = useFollowUpAnalytics();

  const [mobileOpen, setMobileOpen] = useState(false);
  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const applicationFunnelData =
    analyticsData ?? ({} as ApplicationFunnelResponse);

  const applicationFunnelStages = applicationFunnelData
    ? mapApplicationFunnelToStages(applicationFunnelData)
    : [];

  const pipelineHealth =
    healthPipelineData ?? ({} as HealthViewAnalyticsResponse);
  const staleApplications =
    pipelineHealth?.staled_job_applications?.length ?? 0;
  const normalApplications =
    pipelineHealth?.normal_progress_job_applications?.length ?? 0;
  const totalApplications = staleApplications + normalApplications;
  const activePipelinePercent =
    totalApplications > 0
      ? Math.round((normalApplications / totalApplications) * 100)
      : 0;
  const overdueTasks = pipelineHealth?.overdue_tasks ?? 0;
  const upcomingTasks = pipelineHealth?.upcoming_tasks ?? 0;
  const score = Math.max(
    0,
    Math.min(100, 100 - staleApplications * 10 - overdueTasks * 2),
  );

  const weeklyActivity = weeklyActivityData ?? [];

  const mappedData: Point[] = weeklyActivity.map((item) => {
    const [start, end] = item.week_period.split("/");

    return {
      label: `W${item.week_number}`,
      value: item.application_count,
      period: `${new Date(start).toLocaleDateString()} - ${new Date(
        end,
      ).toLocaleDateString()}`,
    };
  });

  const timeInStage = timeInStageData ?? ({} as TimeInStageResponse);

  const mapTimeInStageData = (apiData: TimeInStageResponse) => [
    {
      name: "Applied → Screening",
      days: apiData.average_time_applied_to_screening,
    },
    {
      name: "Screening → Interview",
      days: apiData.average_time_screening_to_interview,
    },
    {
      name: "Interview → Offer",
      days: apiData.average_time_interview_to_offer,
    },
  ];

  const avgTimeInStageValue = timeInStage
    ? Math.round(
        (timeInStage.average_time_applied_to_screening +
          timeInStage.average_time_screening_to_interview +
          timeInStage.average_time_interview_to_offer) /
          3,
      )
    : 0;

  const sourceAnalytics =
    sourceAnalyticsData ?? ({} as SourceAnalyticsResponse);

  const roleAnalytics = roleAnalyticsData ?? ({} as RoleAnalyticsResponse);

  const roleData = Object.entries(roleAnalytics).map(
    ([name, stats]: [string, SourceDetails]) => ({
      name,
      applied: stats.applied_count,
      screened: stats.screened_count,
      interviewed: stats.interviewed_count,
      offers: stats.offers_count,
      accepted: stats.accepted_count,
      responseRate: stats.response_rate,
    }),
  );

  const interviewAnalytics =
    interviewAnalyticsData ?? ({} as InterviewAnalyticsResponse);

  const totalInterviewRounds =
    (interviewAnalytics?.first_round_interview?.total_interviews ?? 0) +
    (interviewAnalytics?.second_round_interview?.total_interviews ?? 0) +
    (interviewAnalytics?.third_round_interview?.total_interviews ?? 0);

  const totalPassedInterviews =
    (interviewAnalytics?.first_round_interview?.passed ?? 0) +
    (interviewAnalytics?.second_round_interview?.passed ?? 0) +
    (interviewAnalytics?.third_round_interview?.passed ?? 0);

  const interviewRate = totalInterviewRounds
    ? Math.round((totalPassedInterviews / totalInterviewRounds) * 100)
    : 0;

  const followUpAnalytics =
    followUpAnalyticsData ?? ({} as FollowUpAnalyticsResponse);

  const topSourceEntry = Object.entries(sourceAnalytics ?? {}).sort(
    ([, a], [, b]) => b.applied_count - a.applied_count,
  )[0];

  const topSourceName = topSourceEntry?.[0];
  const topSourceDetails = topSourceEntry?.[1];

  const followUpRate = followUpAnalytics?.followed_up_job_response_rate ?? 0;
  const insightItems = [
    {
      title: "Interview pass rate",
      value: `${interviewRate}%`,
      note: "Overall interview conversion",
      tone: "success" as const,
      icon: TrendingUp,
    },
    {
      title: "Top source",
      value: topSourceName ?? "N/A",
      note: topSourceDetails
        ? `${topSourceDetails.applied_count} applications`
        : "No source data available",
      tone: "primary" as const,
      icon: Target,
    },
    {
      title: "Stale applications",
      value: `${staleApplications}`,
      note: "Applications needing attention",
      tone: staleApplications > 0 ? ("warning" as const) : ("neutral" as const),
      icon: AlertTriangle,
    },
    {
      title: "Follow-up response rate",
      value: `${followUpRate}%`,
      note: "Candidate responsiveness",
      tone: "neutral" as const,
      icon: MessageSquare,
    },
  ];

  //   const insightItems = [
  //     `Overall interview pass rate is ${interviewRate}%`,
  //     topSourceName && topSourceDetails
  //       ? `${topSourceName} is the top source with ${topSourceDetails.applied_count} applications.`
  //       : "No source data available.",
  //     `${staleApplications} stale applications need attention`,
  //     `Follow-up response rate is ${followUpRate}%`,
  //   ];

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
            avgTimeInStage={`${avgTimeInStageValue}d`}
            healthScore={`${score}%`}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <ApplicationFunnelSection
              className="xl:col-span-2"
              data={applicationFunnelStages}
            />
            <PipelineHealthSection
              score={score}
              staleApplications={staleApplications}
              activePipelinePercent={activePipelinePercent}
              overdueTasks={overdueTasks}
              upcomingTasks={upcomingTasks}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <WeeklyActivitySection data={mappedData} />
            <TimeInStageSection data={mapTimeInStageData(timeInStage)} />
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
                followUpAnalytics.followed_up_job_response_rate
              }
              unfollowedUpJobResponseRate={
                followUpAnalytics.unfollowed_up_job_response_rate
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}
