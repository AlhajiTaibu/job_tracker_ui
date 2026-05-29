import {
    ApplicationFunnelResponse,
    FollowUpAnalyticsResponse,
    HealthViewAnalyticsResponse,
    InterviewAnalyticsResponse,
    RoleAnalyticsResponse,
    SourceAnalyticsResponse,
    TimeInStageResponse,
} from "@/lib/types";
import { mapApplicationFunnelToStages } from "@/components/application-funnel-section";
import { Point } from "@/components/weekly-activity-section";
import { TrendingUp, Target, AlertTriangle, MessageSquare } from "lucide-react";

export function getApplicationFunnelStages(data?: ApplicationFunnelResponse) {
    if (!data || Object.keys(data).length === 0) return [];
    return mapApplicationFunnelToStages(data);
}


export function getPipelineMetrics(data?: HealthViewAnalyticsResponse) {
    const staleApplications = data?.staled_job_applications?.length ?? 0;
    const normalApplications = data?.normal_progress_job_applications?.length ?? 0;
    const totalApplications = staleApplications + normalApplications;
    const activePipelinePercent =
        totalApplications > 0
            ? Math.round((normalApplications / totalApplications) * 100)
            : 0;

    const overdueTasks = data?.overdue_tasks ?? 0;
    const upcomingTasks = data?.upcoming_tasks ?? 0;
    const score = Math.max(
        0,
        Math.min(100, 100 - staleApplications * 10 - overdueTasks * 2),
    );

    return {
        staleApplications,
        normalApplications,
        totalApplications,
        activePipelinePercent,
        overdueTasks,
        upcomingTasks,
        score,
    };
}

export function getWeeklyActivityPoints(
    weeklyActivityData?: Array<{
        week_period: string;
        week_number: number;
        application_count: number;
    }>
): Point[] {
    return (weeklyActivityData ?? []).map((item) => {
        const [start, end] = item.week_period.split("/");
        return {
            label: `W${item.week_number}`,
            value: item.application_count,
            period: `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`,
        };
    });
}

export function getTimeInStageChartData(data?: TimeInStageResponse) {
    return [
        {
            name: "Applied → Screening",
            days: data?.average_time_applied_to_screening ?? 0,
        },
        {
            name: "Screening → Interview",
            days: data?.average_time_screening_to_interview ?? 0,
        },
        {
            name: "Interview → Offer",
            days: data?.average_time_interview_to_offer ?? 0,
        },
    ];
}

export function getAvgTimeInStage(data?: TimeInStageResponse) {
    if (!data) return 0;

    return Math.round(
        (
            (data.average_time_applied_to_screening ?? 0) +
            (data.average_time_screening_to_interview ?? 0) +
            (data.average_time_interview_to_offer ?? 0)
        ) / 3,
    );
}

export function getRoleData(data?: RoleAnalyticsResponse) {
    return Object.entries(data ?? {}).map(([name, stats]: [string, any]) => ({
        name,
        applied: stats.applied_count,
        screened: stats.screened_count,
        interviewed: stats.interviewed_count,
        offers: stats.offers_count,
        accepted: stats.accepted_count,
        responseRate: stats.response_rate,
    }));
}

export function getInterviewMetrics(data?: InterviewAnalyticsResponse) {
    const totalInterviewRounds =
        (data?.first_round_interview?.total_interviews ?? 0) +
        (data?.second_round_interview?.total_interviews ?? 0) +
        (data?.third_round_interview?.total_interviews ?? 0);

    const totalPassedInterviews =
        (data?.first_round_interview?.passed ?? 0) +
        (data?.second_round_interview?.passed ?? 0) +
        (data?.third_round_interview?.passed ?? 0);

    const interviewRate = totalInterviewRounds
        ? Math.round((totalPassedInterviews / totalInterviewRounds) * 100)
        : 0;

    return {
        totalInterviewRounds,
        totalPassedInterviews,
        interviewRate,
    };
}

export function getTopSource(data?: SourceAnalyticsResponse) {
    const topSourceEntry = Object.entries(data ?? {}).sort(
        ([, a], [, b]) => b.applied_count - a.applied_count,
    )[0];

    return {
        topSourceName: topSourceEntry?.[0] ?? "N/A",
        topSourceDetails: topSourceEntry?.[1],
    };
}

export function getInsightItems({
    interviewRate,
    topSourceName,
    topSourceDetails,
    staleApplications,
    followUpRate,
}: {
    interviewRate: number;
    topSourceName: string;
    topSourceDetails?: { applied_count: number };
    staleApplications: number;
    followUpRate: number;
}) {
    return [
        {
            title: "Interview pass rate",
            value: `${interviewRate}%`,
            note: "Overall interview conversion",
            tone: "success" as const,
            icon: TrendingUp,
        },
        {
            title: "Top source",
            value: topSourceName,
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
}
