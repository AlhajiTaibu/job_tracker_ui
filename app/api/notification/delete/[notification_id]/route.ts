import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ notification_id: string }>
};

export async function DELETE(req: Request, context: RouteContext) {
    try {
        const { notification_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `notification/${notification_id}`, {
            method: "DELETE"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Notification deletion failed" }, { status: 400 })
    }
}