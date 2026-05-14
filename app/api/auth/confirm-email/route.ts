import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverApiFetch<{
            success: boolean,
            message: string,
            access_token?: string,
            refresh_token?: string,
            token_type: string,
            user_id?: string
        }>("auth/confirm-email", {
            method: "POST",
            body: JSON.stringify(body),
        })

        return NextResponse.json(data)

    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Confirm email failed" }, { status: 400 })
    }
}