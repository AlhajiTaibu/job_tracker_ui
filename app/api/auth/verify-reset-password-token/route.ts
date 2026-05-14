import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"
import { setAuthCookies } from "@/lib/auth-cookies"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverApiFetch<{
            success: boolean,
            reset_token?: string
        }>("auth/verify-reset-password-token", {
            method: "POST",
            body: JSON.stringify(body),
        })

        await setAuthCookies({
            reset_token: data.reset_token
        })

        return NextResponse.json(data)

    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Verify reset password token failed" }, { status: 400 })
    }
}