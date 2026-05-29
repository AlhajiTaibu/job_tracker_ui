import { useMemo } from "react";
import { useJobs } from "@/hooks/use-jobs";
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
    getApplicationFunnelStages,
    getAvgTimeInStage,
    getInsightItems,
    getInterviewMetrics,
    getPipelineMetrics,
    getRoleData,
    getTimeInStageChartData,
    getTopSource,
    getWeeklyActivityPoints,
} from "@/lib/selectors";

export function useAnalyticsDashboard() {
    const jobsQuery = useJobs({
        search: "",
        filters: {},
        limit: 20,
    });

    const funnelQuery = useAnalytics();
    const pipelineQuery = usePipelineHealthAnalytics();
    const weeklyQuery = useWeeklyActivityAnalytics();
    const timeInStageQuery = useTimeInStageAnalytics();
    const sourceQuery = useSourceAnalytics();
    const roleQuery = useRoleAnalytics();
    const interviewQuery = useInterviewAnalytics();
    const followUpQuery = useFollowUpAnalytics();

    const data = useMemo(() => {
        const applicationFunnelStages = getApplicationFunnelStages(funnelQuery.data);
        const pipelineMetrics = getPipelineMetrics(pipelineQuery.data);
        const weeklyActivity = getWeeklyActivityPoints(weeklyQuery.data);
        const timeInStageChartData = getTimeInStageChartData(timeInStageQuery.data);
        const avgTimeInStage = getAvgTimeInStage(timeInStageQuery.data);
        const roleData = getRoleData(roleQuery.data);
        const { interviewRate } = getInterviewMetrics(interviewQuery.data);
        const { topSourceName, topSourceDetails } = getTopSource(sourceQuery.data);
        const followUpRate =
            followUpQuery.data?.followed_up_job_response_rate ?? 0;

        const insightItems = getInsightItems({
            interviewRate,
            topSourceName,
            topSourceDetails,
            staleApplications: pipelineMetrics.staleApplications,
            followUpRate,
        });

        return {
            jobs: jobsQuery.data?.pages.flatMap((page) => page.payload?.data ?? []) ?? [],
            applicationFunnelStages,
            pipelineMetrics,
            weeklyActivity,
            timeInStageChartData,
            avgTimeInStage,
            sourceAnalytics: sourceQuery.data ?? {},
            roleData,
            interviewAnalytics: interviewQuery.data,
            followUpAnalytics: followUpQuery.data,
            interviewRate,
            insightItems,
        };
    }, [
        jobsQuery.data,
        funnelQuery.data,
        pipelineQuery.data,
        weeklyQuery.data,
        timeInStageQuery.data,
        sourceQuery.data,
        roleQuery.data,
        interviewQuery.data,
        followUpQuery.data,
    ]);

    const isLoading = [
        jobsQuery,
        funnelQuery,
        pipelineQuery,
        weeklyQuery,
        timeInStageQuery,
        sourceQuery,
        roleQuery,
        interviewQuery,
        followUpQuery,
    ].some((query) => query.isLoading || query.isPending);

    const isFetching = [
        jobsQuery,
        funnelQuery,
        pipelineQuery,
        weeklyQuery,
        timeInStageQuery,
        sourceQuery,
        roleQuery,
        interviewQuery,
        followUpQuery,
    ].some((query) => query.isFetching);

    const error =
        jobsQuery.error ??
        funnelQuery.error ??
        pipelineQuery.error ??
        weeklyQuery.error ??
        timeInStageQuery.error ??
        sourceQuery.error ??
        roleQuery.error ??
        interviewQuery.error ??
        followUpQuery.error ??
        null;

    return {
        ...data,
        isLoading,
        isFetching,
        error,
    };
}
