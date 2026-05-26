import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

export async function GET() {
    try {
        const data = await serverProtectedApiFetch("profile")
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        )
    }
}