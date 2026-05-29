import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { SourceAnalyticsResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const endpoint = "reports/source-analytics"
        const data = await serverProtectedApiFetch<SourceAnalyticsResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Source Analytics failed" }, { status: 400 })
    }
}