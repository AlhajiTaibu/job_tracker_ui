import { useInfiniteQuery, keepPreviousData, useQuery } from "@tanstack/react-query"
import { JobApplicationResponse, JobSource, JobStatus } from "@/lib/types"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { create } from "zustand"
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";

type JobsParams = {
    search?: string
    filters?: Record<string, string | number | boolean | undefined>
    cursor?: string | null
    limit?: number
    cookieStore?: ReadonlyRequestCookies
}

type JobApplicationInput = {
    company_name: string
    job_title: string
    description?: string
    status: JobStatus
    source: JobSource
    date_applied?: string
    notes?: string
    job_url?: string
}

type JobApplicationUpdateInput = {
    company_name: string
    job_title: string
    description?: string
    source: JobSource
    date_applied?: string
    notes?: string
    job_url?: string
}


// API functions
const fetchJobs = async ({ search = "", filters = {}, cursor = null, limit = 20, cookieStore = {} as ReadonlyRequestCookies }: JobsParams): Promise<JobApplicationResponse> => {
    let res: Response
    if (typeof window === 'undefined') {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/applications/list`, {
            headers: {
                cookie: cookieStore.toString(),
            },
            next: { revalidate: 60 },
        });
    } else {
        const baseUrl = typeof window !== 'undefined'
            ? ''
            : process.env.NEXT_PUBLIC_SITE_URL

        const params = new URLSearchParams()

        if (search) params.set("q", search)
        if (cursor) params.set("cursor", cursor)
        params.set("limit", String(limit))
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`${baseUrl}/api/applications/list?${params.toString()}`)
    }

    if (!res.ok) {
        throw new Error("Job fetch failed")
    }
    return res.json()
}

const fetchJob = async (id: string) => {
    const res = await fetch(`/api/applications/get/${id}`, {
        method: "GET"
    })

    if (!res.ok) {
        throw new Error("Failed to fetch Job Application")
    }

    return res.json()
}

const addJob = async (data: JobApplicationInput) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/applications/add`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        throw new Error("Job Application creation failed")
    }

    return res.json()
}

const editJob = async (data: JobApplicationUpdateInput, id: string) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL

    const res = await fetch(`${baseUrl}/api/applications/update/${id}`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Job Application update failed")
    }

    return res.json()
}

const deleteJob = async (id: string) => {
    const res = await fetch(`/api/applications/delete/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error("Failed to delete Job Application")
    }

    return res.json()
}

const moveJob = async (id: string, status: JobStatus) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const job_id = id
    const res = await fetch(`${baseUrl}/api/applications/move/${job_id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to_status: status,
            reason: "Move job to next status"
        })
    })
    if (!res.ok) {
        throw new Error("Failed to move job application")
    }
    return res.json()
}


// Zustand stores for managing submission states
type AddJob = {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
}

const useAddJobStore = create<AddJob>((set) => ({
    isSubmitting: false,
    setIsSubmitting: (value) => set({ isSubmitting: value })
}))

type EditJob = {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
}

const useEditJobStore = create<EditJob>((set) => ({
    isSubmitting: false,
    setIsSubmitting: (value) => set({ isSubmitting: value })
}))

type MoveState = {
    movingIds: Record<string, boolean>
    setMoving: (id: string, value: boolean) => void
}

const useMoveStore = create<MoveState>((set) => ({
    movingIds: {},
    setMoving: (id, value) => set((state) => ({
        movingIds: {
            ...state.movingIds,
            [id]: value
        }
    })),
}))


// Query and mutation hooks
export const getJobsQueryOptions = ({ search = "", filters = {}, limit = 20, cookieStore = {} as ReadonlyRequestCookies }: Omit<JobsParams, "cursor"> = {}) => ({
    queryKey: ["jobs", { search, filters, limit }] as const,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => fetchJobs({ search, filters, cursor: pageParam, limit, cookieStore }),
    getNextPageParam: (lastPage: any) => lastPage?.payload?.next_cursor ?? undefined,
    placeholderData: keepPreviousData,
    initialPageParam: null as string | null,
    enabled: search.trim().length === 0 || search.trim().length >= 3,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,

})

const useJobs = ({ search = "", filters = {}, limit = 20 }: Omit<JobsParams, "cursor"> = {}) => {
    return useInfiniteQuery(getJobsQueryOptions({ search, filters, limit }))
}

const useJob = (id?: string) => {
    return useQuery({
        queryKey: ["job", id],
        queryFn: () => fetchJob(id!),
        enabled: !!id,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    })
}

const useAddJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: JobApplicationInput) => addJob(data),

        onMutate: async (newJob) => {
            await queryClient.cancelQueries({ queryKey: ["jobs"] })
            const previousJobs = queryClient.getQueriesData({ queryKey: ['jobs'] })

            queryClient.setQueriesData({ queryKey: ['jobs'] }, (old: InfiniteData<JobApplicationResponse | undefined>) => {
                if (!old) return old

                const optimisticJob = {
                    ...newJob,
                    id: crypto.randomUUID(),
                    created_at: new Date().toISOString()
                }

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: [...(page?.payload.data ?? []), optimisticJob],
                            },
                        }
                    })
                }
            })

            return { previousJobs }
        },

        onError: (_err, _newJob, context) => {
            context?.previousJobs?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            queryClient.invalidateQueries({ queryKey: ["pipeline-health"] })
            queryClient.invalidateQueries({ queryKey: ["application-funnel"] })
            queryClient.invalidateQueries({ queryKey: ["weekly-activity"] })
            queryClient.invalidateQueries({ queryKey: ["time-in-stage"] })
            queryClient.invalidateQueries({ queryKey: ["source-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["role-analytics"] })
        }
    })
}

const useEditJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, id }: { data: JobApplicationUpdateInput, id: string }) => editJob(data, id),

        onMutate: async ({ data, id }) => {
            await queryClient.cancelQueries({ queryKey: ["jobs"] })
            const previousJobs = queryClient.getQueriesData({ queryKey: ['jobs'] })
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
            )

            queryClient.setQueriesData({ queryKey: ['jobs'] }, (old: InfiniteData<JobApplicationResponse | undefined>) => {
                if (!old) return old

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: page?.payload?.data?.map((app) =>
                                    app.id === id ? { ...app, ...cleanedData } : app
                                )
                            }
                        }
                    })
                }
            })

            return { previousJobs }
        },

        onError: (_err, _vars, context) => {
            context?.previousJobs?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            queryClient.invalidateQueries({ queryKey: ["pipeline-health"] })
            queryClient.invalidateQueries({ queryKey: ["application-funnel"] })
            queryClient.invalidateQueries({ queryKey: ["weekly-activity"] })
            queryClient.invalidateQueries({ queryKey: ["time-in-stage"] })
            queryClient.invalidateQueries({ queryKey: ["source-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["role-analytics"] })
        }
    })
}

const useDeleteJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteJob(id),

        onMutate: async ({ id }) => {
            const previousJobs = queryClient.getQueriesData({ queryKey: ['jobs'] })

            queryClient.setQueriesData({ queryKey: ['jobs'] }, (old: InfiniteData<JobApplicationResponse | undefined>) => {
                if (!old) return old

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: page?.payload?.data?.filter((app) =>
                                    app.id !== id
                                )
                            }
                        }
                    })
                }
            })
            return { previousJobs }
        },

        onError: (_err, _vars, context) => {
            context?.previousJobs?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            queryClient.invalidateQueries({ queryKey: ["pipeline-health"] })
            queryClient.invalidateQueries({ queryKey: ["application-funnel"] })
            queryClient.invalidateQueries({ queryKey: ["weekly-activity"] })
            queryClient.invalidateQueries({ queryKey: ["time-in-stage"] })
            queryClient.invalidateQueries({ queryKey: ["source-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["role-analytics"] })
        }
    })
}

const useMoveJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: JobStatus }) => moveJob(id, status),

        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })

            const previousJobs = queryClient.getQueriesData({ queryKey: ['jobs'] })

            queryClient.setQueriesData({ queryKey: ['jobs'] }, (old: InfiniteData<JobApplicationResponse | undefined>) => {
                if (!old) return old

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: page?.payload?.data?.map((app) =>
                                    app.id === id ? { ...app, status } : app
                                )
                            }
                        }
                    })
                }
            })

            return { previousJobs }

        },

        onError: (_err, _vars, context) => {
            context?.previousJobs?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
            queryClient.invalidateQueries({ queryKey: ["pipeline-health"] })
            queryClient.invalidateQueries({ queryKey: ["application-funnel"] })
            queryClient.invalidateQueries({ queryKey: ["weekly-activity"] })
            queryClient.invalidateQueries({ queryKey: ["time-in-stage"] })
            queryClient.invalidateQueries({ queryKey: ["source-analytics"] })
            queryClient.invalidateQueries({ queryKey: ["role-analytics"] })
        }
    })
}

// hooks
const useHandleJobAdd = () => {
    const { mutateAsync } = useAddJob()
    const setIsSubmitting = useAddJobStore((state) => state.setIsSubmitting)
    const { toast } = useToast()


    const handleJobAdd = useCallback(
        async (data: JobApplicationInput) => {
            setIsSubmitting(true)
            try {
                await mutateAsync(data)
                toast({
                    title: "Job Application Creation",
                    description: "New Job Application added"
                })
            } catch {
                toast({
                    title: "Job Application Creation Failed",
                    description: "New Job Application addition failed",
                    variant: "destructive"
                })
            }
            finally {
                setIsSubmitting(false)
            }
        },
        [mutateAsync, setIsSubmitting, toast]
    )

    return { handleJobAdd }
}

const useHandleJobEdit = () => {
    const { mutateAsync } = useEditJob()
    const setIsSubmitting = useEditJobStore((state) => state.setIsSubmitting)
    const { toast } = useToast()


    const handleJobEdit = useCallback(
        async (data: JobApplicationUpdateInput, id: string) => {
            setIsSubmitting(true)
            try {
                await mutateAsync({ data, id })
                toast({
                    title: "Job Application Update",
                    description: "Job Application updated"
                })
            } catch {
                toast({
                    title: "Job Application Update Failed",
                    description: "Job Application update failed",
                    variant: "destructive"
                })
            }
            finally {
                setIsSubmitting(false)
            }
        },
        [mutateAsync, setIsSubmitting, toast]
    )

    return { handleJobEdit }
}

const useHandleJobDelete = () => {
    const { mutateAsync } = useDeleteJob()
    const { toast } = useToast()

    const handleJobDelete = useCallback(async (id: string) => {
        try {
            await mutateAsync({ id })
            toast({
                title: "Job Application Deleted",
                description: "Job Application deleted successfully"
            })
        } catch {
            toast({
                title: "Job Application Deletion Failed",
                description: "Job Application deletion failed",
                variant: "destructive"
            })
        }

    }, [toast, mutateAsync])
    return { handleJobDelete }
}

const useHandleMove = () => {
    const { mutateAsync } = useMoveJob()
    const setMoving = useMoveStore((state) => state.setMoving)
    const { toast } = useToast()

    const handleMove = useCallback(
        async (id: string, fromStatus: JobStatus, toStatus: JobStatus) => {
            setMoving(id, true)
            try {
                await mutateAsync({ id: id, status: toStatus })
                toast({
                    title: "Job moved",
                    description:
                        fromStatus === ("screening" as JobStatus) &&
                            toStatus === ("interviewing" as JobStatus)
                            ? `A new interview was created when this job was moved to ${toStatus}`
                            : `Moved from ${fromStatus} to ${toStatus}`
                })
            } catch {
                toast({
                    title: "Move failed",
                    description: "Could not move application",
                    variant: "destructive"
                })
            }
            finally {
                setMoving(id, false)
            }
        },
        [mutateAsync, setMoving, toast]
    )

    return { handleMove }
}

export {
    fetchJobs,
    useAddJobStore,
    useEditJobStore,
    useMoveStore,
    useJobs,
    useJob,
    useHandleJobAdd,
    useHandleJobEdit,
    useHandleJobDelete,
    useMoveJob,
    useHandleMove,
}