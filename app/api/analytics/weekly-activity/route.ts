import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { WeeklyActivityResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const endpoint = "reports/weekly-application-activity"
        const data = await serverProtectedApiFetch<WeeklyActivityResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Weekly Activity Analytics failed" }, { status: 400 })
    }
}