import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverApiFetch<{
            message: string,
            expires_in: string,
            success: boolean
        }>("auth/register", {
            method: "POST",
            body: JSON.stringify(body),
        })

        return NextResponse.json(data)

    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Register failed" }, { status: 400 })
    }
}