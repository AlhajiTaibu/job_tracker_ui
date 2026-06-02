import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query"
import { JobApplicationResponse } from "@/lib/types"

type JobsParams = {
    search?: string
    filters?: Record<string, string | number | boolean | undefined>
    cursor?: string | null
    limit?: number
}

const fetchJobs = async ({ search = "", filters = {}, cursor = null, limit = 20 }: JobsParams): Promise<JobApplicationResponse> => {
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
    const res = await fetch(`${baseUrl}/api/applications/list?${params.toString()}`)
    if (!res.ok) {
        throw new Error("Job fetch failed")
    }
    return res.json()
}


const useJobs = ({ search = "", filters = {}, limit = 20 }: Omit<JobsParams, "cursor"> = {}) => {
    return useInfiniteQuery({
        queryKey: ["jobs", { search, filters, limit }],
        queryFn: ({ pageParam = null }) => fetchJobs({ search, filters, cursor: pageParam, limit }),
        getNextPageParam: (lastPage) => lastPage?.payload?.next_cursor ?? undefined,
        placeholderData: keepPreviousData,
        initialPageParam: null as string | null,
        enabled: search.trim().length === 0 || search.trim().length >= 3,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    })
}


export { fetchJobs, useJobs }