import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ task_id: string }>
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const body = await req.json()
        const { task_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `task/cancel/${task_id}`, {
            method: "POST",
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Task cancellation failed" }, { status: 400 })
    }
}