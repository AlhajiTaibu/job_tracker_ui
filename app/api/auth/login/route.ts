import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"
import { setAuthCookies } from "@/lib/auth-cookies"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const encodedBody = Object.keys(body)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
            .join('&');
        const data = await serverApiFetch<{
            success: boolean,
            message: string,
            access_token?: string,
            refresh_token?: string,
            token_type: string,
            user_id?: string

        }>("auth/login", {
            method: "POST",
            body: encodedBody
        })

        await setAuthCookies({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        })

        return NextResponse.json({
            user_id: data.user_id || null,
            message: data.message || "Login successful",
        })

    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Login failed" }, { status: 400 })
    }
}