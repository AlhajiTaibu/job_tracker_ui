import { useQuery } from "@tanstack/react-query";
import {
    ApplicationFunnelResponse,
    HealthViewAnalyticsResponse,
    SourceAnalyticsResponse,
    TimeInStageResponse,
    WeeklyActivityResponse,
    RoleAnalyticsResponse,
    InterviewAnalyticsResponse,
    FollowUpAnalyticsResponse
} from "@/lib/types";


const fetchApplicationFunnel = async (): Promise<ApplicationFunnelResponse> => {
    const res = await fetch("/api/analytics/application-funnel", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Application Funnel fetch failed");
    }
    return res.json();
}

const fetchHealthViewAnalytics = async (): Promise<HealthViewAnalyticsResponse> => {
    const res = await fetch("/api/analytics/pipeline-health", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Health View Analytics fetch failed");
    }
    return res.json();
}

const fetchWeeklyActivityAnalytics = async (): Promise<WeeklyActivityResponse[]> => {
    const res = await fetch("/api/analytics/weekly-activity", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Weekly Activity Analytics fetch failed");
    }
    return res.json();
}

const fetchTimeInStageAnalytics = async (): Promise<TimeInStageResponse> => {
    const res = await fetch("/api/analytics/time-in-stage", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Time In Stage Analytics fetch failed");
    }
    return res.json();
}

const fetchSourceAnalytics = async (): Promise<SourceAnalyticsResponse> => {
    const res = await fetch("/api/analytics/source-analytics", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Source Analytics fetch failed");
    }
    return res.json();
}

const fetchRoleAnalytics = async (): Promise<RoleAnalyticsResponse> => {
    const res = await fetch("/api/analytics/role-analytics", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Role Analytics fetch failed");
    }
    return res.json();
}

const fetchInterviewAnalytics = async (): Promise<InterviewAnalyticsResponse> => {
    const res = await fetch("/api/analytics/interview-analytics", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Interview Analytics fetch failed");
    }
    return res.json();
}

const fetchFollowUpAnalytics = async (): Promise<FollowUpAnalyticsResponse> => {
    const res = await fetch("/api/analytics/follow-up-analytics", {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Follow up Analytics fetch failed");
    }
    return res.json();
}


const useAnalytics = () => {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: fetchApplicationFunnel,
        staleTime: 60 * 1000,
    })
}

const usePipelineHealthAnalytics = () => {
    return useQuery({
        queryKey: ["pipeline-health"],
        queryFn: fetchHealthViewAnalytics,
        staleTime: 60 * 1000,
    })
}

const useWeeklyActivityAnalytics = () => {
    return useQuery({
        queryKey: ["weekly-activity"],
        queryFn: fetchWeeklyActivityAnalytics,
        staleTime: 60 * 1000,
    })
}

const useTimeInStageAnalytics = () => {
    return useQuery({
        queryKey: ["time-in-stage"],
        queryFn: fetchTimeInStageAnalytics,
        staleTime: 60 * 1000,
    })
}

const useSourceAnalytics = () => {
    return useQuery({
        queryKey: ["source-analytics"],
        queryFn: fetchSourceAnalytics,
        staleTime: 60 * 1000,
    })
}

const useRoleAnalytics = () => {
    return useQuery({
        queryKey: ["role-analytics"],
        queryFn: fetchRoleAnalytics,
        staleTime: 60 * 1000,
    })
}


const useInterviewAnalytics = () => {
    return useQuery({
        queryKey: ["interview-analytics"],
        queryFn: fetchInterviewAnalytics,
        staleTime: 60 * 1000,
    })
}

const useFollowUpAnalytics = () => {
    return useQuery({
        queryKey: ["follow-up-analytics"],
        queryFn: fetchFollowUpAnalytics,
        staleTime: 60 * 1000,
    })
}

export {
    useAnalytics,
    usePipelineHealthAnalytics,
    useWeeklyActivityAnalytics,
    useTimeInStageAnalytics,
    useSourceAnalytics,
    useRoleAnalytics,
    useInterviewAnalytics,
    useFollowUpAnalytics
}