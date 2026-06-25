import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"


export async function GET(req: Request) {
    try {
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            "notification/notifications", {
            method: "GET"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Notifications retrieval failed" }, { status: 400 })
    }
}