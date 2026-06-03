import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ task_id: string }>
};

export async function DELETE(req: Request, context: RouteContext) {
    try {
        const { task_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `task/delete/${task_id}`, {
            method: "DELETE"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Task deletion failed" }, { status: 400 })
    }
}