import { cookies } from "next/headers"


export async function setAuthCookies(tokens: {
    access_token?: string,
    refresh_token?: string,
    reset_token?: string
}) {
    const cookieStore = await cookies()

    if (tokens.access_token) {
        cookieStore.set("access_token", tokens.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15 // 15 minutes
        })
    }

    if (tokens.refresh_token) {
        cookieStore.set("refresh_token", tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })
    }

    if (tokens.reset_token) {
        cookieStore.set("reset_token", tokens.reset_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 5 // 5 minutes
        })
    }
}

export async function clearAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.set("access_token", "", { path: "/", maxAge: 0 })
    cookieStore.set("refresh_token", "", { path: "/", maxAge: 0 })
}

export async function getAuthCookies() {
    const cookieStore = await cookies()

    return {
        access_token: cookieStore.get("access_token")?.value || null,
        refresh_token: cookieStore.get("refresh_token")?.value || null,
        reset_token: cookieStore.get("reset_token")?.value || null,
    }
}