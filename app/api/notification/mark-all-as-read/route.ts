import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"


export async function PATCH(req: Request) {
    try {
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            `notification/mark-all-as-read`, {
            method: "PATCH"
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Mark all notifications read failed" }, { status: 400 })
    }
}