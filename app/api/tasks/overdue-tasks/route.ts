import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { TaskResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const { searchParams } = new URL(req.url)
        const queryString = searchParams.toString()
        const endpoint = queryString
            ? `task/overdue_tasks?${queryString}`
            : "task/overdue_tasks"
        const data = await serverProtectedApiFetch<TaskResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Overdue Task List failed" }, { status: 400 })
    }
}