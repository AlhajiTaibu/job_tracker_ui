import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { InterviewFormat, InterviewOutcome, InterviewResponse } from "@/lib/types";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type InterviewInput = {
    format: InterviewFormat;
    date?: string;
    time?: string;
    round?: number;
    notes?: string;
    job_application_id: string;
    interviewer_name?: string;
    actual_duration?: string;
    estimated_duration?: string;
    timezone?: string;
    outcome?: InterviewOutcome;
}

type InterviewParams = {
    search?: string
    filters?: Record<string, string | number | boolean | undefined>
    cursor?: string | null
    limit?: number
    cookieStore?: ReadonlyRequestCookies
}

// API functions
const fetchUpcomingInterviews = async ({ search = "", limit = 20, cookieStore = {} as ReadonlyRequestCookies }: InterviewParams): Promise<InterviewResponse> => {
    let res: Response
    if (typeof window === 'undefined') {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/interviews/upcoming-interviews`, {
            headers: {
                cookie: cookieStore.toString(),
            },
            next: { revalidate: 60 },
        });
    } else {
        const params = new URLSearchParams()
        if (search) params.set("q", search)
        if (limit) params.set("limit", limit.toString());
        res = await fetch(`/api/interviews/upcoming-interviews?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    }

    if (!res.ok) {
        throw new Error("Upcoming interviews fetch failed");
    }
    return res.json();
};

const fetchInterviewHistory = async ({ filters = {}, search = "", cursor = null, limit = 20, cookieStore = {} as ReadonlyRequestCookies }: InterviewParams): Promise<InterviewResponse> => {
    let res: Response
    if (typeof window === 'undefined') {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/interviews/interviews-history`, {
            headers: {
                cookie: cookieStore.toString(),
            },
            next: { revalidate: 60 },
        });
    } else {
        const params = new URLSearchParams()
        if (search) params.set("q", search)
        if (limit) params.set("limit", limit.toString());
        if (cursor) params.set("cursor", cursor)
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`/api/interviews/interviews-history?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    }

    if (!res.ok) {
        throw new Error("Historic interviews fetch failed");
    }
    return res.json();
};

const addInterview = async (newInterview: InterviewInput) => {
    const res = await fetch("/api/interviews/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newInterview),
    });

    if (!res.ok) {
        throw new Error("Interview addition failed");
    }
    return res.json();
}

const updateInterview = async ({ interview_id, updatedData }: { interview_id: string; updatedData: Partial<InterviewInput> }) => {
    const res = await fetch(`/api/interviews/update/${interview_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        throw new Error("Interview update failed");
    }
    return res.json();
}

const deleteInterview = async (interview_id: string) => {
    const res = await fetch(`/api/interviews/delete/${interview_id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Interview deletion failed");
    }
    return res.json();
}

const fetchJobInterviews = async ({ job_id, limit }: { job_id: string; limit?: number }) => {
    const params = new URLSearchParams()
    if (limit) params.set("limit", limit.toString());
    const res = await fetch(`/api/interviews/list/${job_id}?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Interview fetch failed");
    }
    return res.json();
}


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


const useAddInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addInterview,
        onMutate: async (newInterview) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-interviews"] });
            const previousData = queryClient.getQueryData<InterviewResponse>(["upcoming-interviews"]);

            queryClient.setQueryData<InterviewResponse>(['upcoming-interviews'], (old) => {
                if (!old) return old

                const optimisticInterview = {
                    ...newInterview,
                    id: crypto.randomUUID(),
                    job_application_id: crypto.randomUUID(),
                    company_name: "",
                    job_title: "",
                    outcome: "scheduled" as InterviewOutcome,
                    notes: "",
                    round: 1,
                    created_at: new Date().toISOString(),
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: [...(old.payload.data ?? []), optimisticInterview],
                    },
                }
            })
            return { previousData }
        },
        onError: (err, newInterview, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["upcoming-interviews"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-interviews"] });
            queryClient.invalidateQueries({ queryKey: ["interviews-history"] });
        },
    });
}

const useUpdateInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateInterview,
        onMutate: async ({ interview_id, updatedData }) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-interviews"] });
            const previousData = queryClient.getQueryData<InterviewResponse>(["upcoming-interviews"]);

            queryClient.setQueryData<InterviewResponse>(['upcoming-interviews'], (old) => {
                if (!old) return old
                const newUpdatedData = {
                    ...updatedData
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.map((interview) =>
                            interview.id === interview_id ? { ...interview, ...newUpdatedData } : interview
                        ),
                    },
                }
            })
            return { previousData }
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["upcoming-interviews"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-interviews"] });
            queryClient.invalidateQueries({ queryKey: ["interviews-history"] });
        },
    });
}

const useDeleteInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteInterview,
        onMutate: async (interview_id) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-interviews"] });
            const previousData = queryClient.getQueryData<InterviewResponse>(["upcoming-interviews"]);

            queryClient.setQueryData<InterviewResponse>(['upcoming-interviews'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.filter((interview) => interview.id !== interview_id),
                    },
                }
            })
            return { previousData }
        },
        onError: (err, interview_id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["upcoming-interviews"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-interviews"] });
            queryClient.invalidateQueries({ queryKey: ["interviews-history"] });
        },
    });
}

export const getUpcomingInterviewsQueryOptions = ({
    search = "",
    limit = 20,
    cookieStore = {} as ReadonlyRequestCookies }: InterviewParams) => ({
        queryKey: ["upcoming-interviews", { search, limit }],
        queryFn: () => fetchUpcomingInterviews({ search, limit, cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
        enabled: search.trim().length === 0 || search.trim().length >= 3,
    })

const useUpcomingInterviews = ({ search = "", limit = 20 }: InterviewParams) => {
    return useQuery(getUpcomingInterviewsQueryOptions({ search, limit }));
    // return useQuery({
    //     queryKey: ["upcoming-interviews", { search, limit }],
    //     queryFn: () => fetchUpcomingInterviews({ search, limit }),
    //     staleTime: Infinity,
    //     gcTime: 10 * 60 * 1000,
    //     enabled: search.trim().length === 0 || search.trim().length >= 3,
    // });
};

export const getInterviewsHistoryQueryOptions = ({
    filters = {},
    search = "",
    limit = 20,
    cookieStore = {} as ReadonlyRequestCookies
}: InterviewParams) => ({
    queryKey: ["interviews-history", { search, filters, limit }],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => fetchInterviewHistory({ search, filters, cursor: pageParam, limit, cookieStore }),
    getNextPageParam: (lastPage: InterviewResponse) => lastPage.payload?.next_cursor ?? undefined,
    placeholderData: keepPreviousData,
    initialPageParam: null as string | null,
    enabled: search.trim().length === 0 || search.trim().length >= 3,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
})

const useInterviewsHistory = ({ filters = {}, search = "", limit = 20 }: Omit<InterviewParams, "cursor"> = {}) => {
    return useInfiniteQuery(getInterviewsHistoryQueryOptions({ filters, search, limit }));
    // return useInfiniteQuery({
    //     queryKey: ["interviews-history", { search, filters, limit }],
    //     queryFn: ({ pageParam = null }) => fetchInterviewHistory({ search, filters, cursor: pageParam, limit }),
    //     getNextPageParam: (lastPage) => lastPage.payload?.next_cursor ?? undefined,
    //     placeholderData: keepPreviousData,
    //     initialPageParam: null as string | null,
    //     enabled: search.trim().length === 0 || search.trim().length >= 3,
    //     staleTime: Infinity,
    //     gcTime: 10 * 60 * 1000,
    //     refetchOnMount: true
    // })
};

const useJobInterviews = ({ job_id, limit = 20 }: { job_id: string; limit?: number }) => {
    return useQuery({
        queryKey: ["job-interviews", { job_id, limit }],
        queryFn: () => fetchJobInterviews({ job_id, limit }),
        staleTime: 60 * 1000,
    });
};

const useHandleAddInterview = () => {
    const { mutateAsync: addInterviewAsync } = useAddInterview();
    const { toast } = useToast();
    const setIsSubmitting = useAddInterviewStore((state) => state.setSubmitting);

    const handleAddInterview = useCallback(async (newInterview: InterviewInput) => {
        try {
            setIsSubmitting(true);
            await addInterviewAsync(newInterview);
            toast({
                title: "Success",
                description: "Interview added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add interview",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [addInterviewAsync, toast, setIsSubmitting]);

    return { handleAddInterview };
}

const useHandleUpdateInterview = () => {
    const { mutateAsync: updateInterviewAsync } = useUpdateInterview();
    const { toast } = useToast();
    const setIsEditing = useEditInterviewStore((state) => state.setIsEditing);

    const handleUpdateInterview = useCallback(async ({ interview_id, updatedData }: { interview_id: string; updatedData: Partial<InterviewInput> }) => {
        try {
            setIsEditing(true);
            await updateInterviewAsync({ interview_id, updatedData });
            toast({
                title: "Success",
                description: "Interview updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update interview",
                variant: "destructive",
            });
        } finally {
            setIsEditing(false);
        }
    }, [updateInterviewAsync, toast, setIsEditing]);

    return { handleUpdateInterview };
}

const useHandleDeleteInterview = () => {
    const { mutateAsync: deleteInterviewAsync } = useDeleteInterview();
    const { toast } = useToast();

    const handleDeleteInterview = useCallback(async (interview_id: string) => {
        try {
            await deleteInterviewAsync(interview_id);
            toast({
                title: "Success",
                description: "Interview deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete interview",
                variant: "destructive",
            });
        }
    }, [deleteInterviewAsync, toast]);

    return { handleDeleteInterview };
}

export {
    useAddInterviewStore,
    useEditInterviewStore,
    useUpcomingInterviews,
    useInterviewsHistory,
    useHandleAddInterview,
    useHandleUpdateInterview,
    useHandleDeleteInterview,
    useJobInterviews
}