import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { JobApplication, JobApplicationResponse } from "@/lib/types"


const fetchJobs = async (): Promise<JobApplicationResponse> => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/applications/list`)
    if (!res.ok) {
        throw new Error("Job fetch failed")
    }
    return res.json()
}


const useJobs = () => {
    return useQuery({
        queryKey: ["jobs"],
        queryFn: fetchJobs
    })
}


export { fetchJobs, useJobs }