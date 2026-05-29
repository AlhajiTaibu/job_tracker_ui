import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { InterviewAnalyticsResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const endpoint = "reports/interview-analytics"
        const data = await serverProtectedApiFetch<InterviewAnalyticsResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Interview Analytics failed" }, { status: 400 })
    }
}