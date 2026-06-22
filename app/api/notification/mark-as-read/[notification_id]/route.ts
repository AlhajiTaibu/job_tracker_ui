import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ notification_id: string }>
};

export async function PATCH(req: Request, context: RouteContext) {
    try {
        const { notification_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `notification/mark-as-read/${notification_id}`, {
            method: "PATCH"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Reading notification failed" }, { status: 400 })
    }
}