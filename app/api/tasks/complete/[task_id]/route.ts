import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ task_id: string }>
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const { task_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `task/complete/${task_id}`, {
            method: "POST"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Task completion failed" }, { status: 400 })
    }
}