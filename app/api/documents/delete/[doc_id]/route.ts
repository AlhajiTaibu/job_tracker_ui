import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

type RouteContext = {
    params: Promise<{ doc_id: string }>
};

export async function DELETE(req: Request, context: RouteContext) {
    try {
        const { doc_id } = await context.params;
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `document/delete/${doc_id}`, {
            method: "DELETE"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Document deletion failed" }, { status: 400 })
    }
}