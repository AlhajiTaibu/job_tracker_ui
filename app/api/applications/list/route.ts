import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { JobApplication, JobApplicationResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const { searchParams } = new URL(req.url)
        const queryString = searchParams.toString()
        const endpoint = queryString
            ? `job_application/list?${queryString}`
            : "job_application/list"
        const data = await serverProtectedApiFetch<JobApplicationResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Job Application List failed" }, { status: 400 })
    }
}