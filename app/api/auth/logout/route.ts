import { NextResponse } from "next/server"
import { serverApiFetch } from "@/lib/server-api"
import { clearAuthCookies, getAuthCookies } from "@/lib/auth-cookies"

export async function POST(req: Request) {
    try {
        const { access_token, refresh_token } = await getAuthCookies()

        if (refresh_token) {
            await serverApiFetch<{
                success: boolean,
                message: string
            }>("auth/logout", {
                method: "POST",
                headers: access_token ? { "Authorization": `Bearer ${access_token}` } : {},
                body: JSON.stringify({ refresh_token: refresh_token }),
            })

        }

    } catch { }
    await clearAuthCookies()
    return NextResponse.json({ message: "Logged out" })
}