import { useQuery } from "@tanstack/react-query"
import { JobApplication, JobApplicationResponse } from "@/lib/types"


const fetchJobs = async (): Promise<JobApplicationResponse> => {
    const res = await fetch("/api/applications/list")
    if (!res.ok) {
        throw new Error("Job fetch failed")
    }
    return res.json()
}


const useJobs = () => {
    return useQuery({
        queryKey: ["jobs"],
        queryFn: () => fetchJobs(),
    })
}


export { fetchJobs, useJobs }