import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { JobApplication, JobApplicationResponse } from "@/lib/types"

type RouteContext = {
    params: Promise<{ job_id: string }>
};

export async function GET(req: Request, context: RouteContext) {
    try {
        const { job_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `job_application/get/${job_id}`, {
            method: "GET"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Job Application retrieval failed" })
    }
}