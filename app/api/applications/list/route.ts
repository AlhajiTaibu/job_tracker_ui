import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { JobApplication, JobApplicationResponse } from "@/lib/types"


export async function GET(req: Request) {
    try {
        const data = await serverProtectedApiFetch<JobApplicationResponse>(
            "job_application/list", {
            method: "GET"
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Job Application List failed" }, { status: 400 })
    }
}