import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const { searchParams } = new URL(req.url)
        const queryString = searchParams.toString()
        const endpoint = queryString
            ? `interview/upcoming_interviews?${queryString}`
            : "interview/upcoming_interviews"
        const data = await serverProtectedApiFetch<{ success: boolean, error?: string }>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Upcoming Interviews fetch failed" }, { status: 400 })
    }
}