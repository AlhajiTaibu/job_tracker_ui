import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { FollowUpAnalyticsResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const endpoint = "reports/follow-up-analytics"
        const data = await serverProtectedApiFetch<FollowUpAnalyticsResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Follow up Analytics failed" }, { status: 400 })
    }
}