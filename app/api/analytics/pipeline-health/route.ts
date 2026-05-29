import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { HealthViewAnalyticsResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const endpoint = "reports/health-view-analytics"
        const data = await serverProtectedApiFetch<HealthViewAnalyticsResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Health View Analytics failed" }, { status: 400 })
    }
}