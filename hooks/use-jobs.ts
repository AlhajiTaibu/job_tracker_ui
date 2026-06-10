import { useInfiniteQuery, keepPreviousData, useQuery } from "@tanstack/react-query"
import { JobApplicationResponse } from "@/lib/types"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

type JobsParams = {
    search?: string
    filters?: Record<string, string | number | boolean | undefined>
    cursor?: string | null
    limit?: number
    cookieStore?: ReadonlyRequestCookies
}

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


export { fetchJobs, useJobs, useJob }