import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ doc_id: string }>
};

export async function POST(req: Request, context: RouteContext) {
    try {
        const body = await req.json()
        const { doc_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `document/unlink-to-application/${doc_id}`, {
            method: "POST",
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Document unlinking failed" }, { status: 400 })
    }
}