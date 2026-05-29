import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ contact_id: string }>
};

export async function GET(req: Request, context: RouteContext) {
    try {
        const { contact_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `contacts/get/${contact_id}`, {
            method: "GET"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Contact retrieval failed" }, { status: 400 })
    }
}