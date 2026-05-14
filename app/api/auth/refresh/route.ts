import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"
import { clearAuthCookies, setAuthCookies } from "@/lib/auth-cookies"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverApiFetch<{
            message: string,
            access_token?: string,
            token_type: string,
        }>("auth/refresh-token", {
            method: "POST",
            body: JSON.stringify(body),
        })

        await setAuthCookies({
            access_token: data.access_token
        })

        return NextResponse.json({ message: data.message || "Token refreshed successfully" })

    } catch (error) {
        await clearAuthCookies()
        return NextResponse.json({ message: error instanceof Error ? error.message : "Refresh token failed" }, { status: 400 })
    }
}