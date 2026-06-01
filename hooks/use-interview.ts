import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InterviewFormat, InterviewResponse } from "@/lib/types";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";

type InterviewInput = {
    name: string;
    format: InterviewFormat;
    date: string;
    time: string;
    round: number;
    linkedIn_url?: string;
    notes?: string;
}

type InterviewParams = {
    search?: string
    limit?: number
}

// API functions
const fetchUpcomingInterviews = async ({ search = "", limit = 20 }: InterviewParams): Promise<InterviewResponse> => {
    const params = new URLSearchParams()

    if (search) params.set("q", search)
    if (limit) params.set("limit", limit.toString());
    const res = await fetch(`/api/interviews/upcoming-interviews?${params.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Upcoming interviews fetch failed");
    }
    return res.json();
};

const fetchInterviewHistory = async ({ search = "", limit = 20 }: InterviewParams): Promise<InterviewResponse> => {
    const params = new URLSearchParams()

    if (search) params.set("q", search)
    if (limit) params.set("limit", limit.toString());
    const res = await fetch(`/api/interviews/interviews-history?${params.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Historic interviews fetch failed");
    }
    return res.json();
};

// Zustand stores for managing submission states
type AddInterviewStore = {
    isSubmitting: boolean;
    setSubmitting: (value: boolean) => void;
}

const useAddInterviewStore = create<AddInterviewStore>((set) => ({
    isSubmitting: false,
    setSubmitting: (value: boolean) => set({ isSubmitting: value }),
}));

type EditInterviewStore = {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

const useEditInterviewStore = create<EditInterviewStore>((set) => ({
    isEditing: false,
    setIsEditing: (value: boolean) => set({ isEditing: value }),
}));


const useUpcomingInterviews = ({ search = "", limit = 20 }: InterviewParams) => {
    return useQuery({
        queryKey: ["upcoming-interviews", { search, limit }],
        queryFn: () => fetchUpcomingInterviews({ search, limit }),
        staleTime: 60 * 1000,
        enabled: search.trim().length === 0 || search.trim().length >= 3,
    });
};

const useInterviewsHistory = ({ search = "", limit = 20 }: InterviewParams) => {
    return useQuery({
        queryKey: ["interviews-history", { search, limit }],
        queryFn: () => fetchInterviewHistory({ search, limit }),
        staleTime: 60 * 1000,
        enabled: search.trim().length === 0 || search.trim().length >= 3,
    });
};


export {
    useAddInterviewStore,
    useEditInterviewStore,
    useUpcomingInterviews,
    useInterviewsHistory
}