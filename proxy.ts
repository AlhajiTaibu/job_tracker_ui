import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { b64ToDict } from "@/lib/utils"

const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/applications",
    "/contacts",
    "/analytics",
    "/settings",

]
const passwordResetRoute = ["/reset-password"]
const authRoutes = ["/login", "/register", "/forgot-password", "/verify-email"]

export function proxy(request: NextRequest) {
    const access_token = request.cookies.get("access_token")?.value
    const refresh_token = request.cookies.get("refresh_token")?.value
    const reset_token = request.cookies.get("reset_token")?.value
    const { pathname } = request.nextUrl

    const { searchParams } = new URL(request.url);
    const encoded = searchParams.get("token");
    const tokenData = encoded ? b64ToDict(encoded) : null;
    const accessToken = tokenData?.access_token;
    const refreshToken = tokenData?.refresh_token;

    const isAuthenticated = !!(access_token || refresh_token || accessToken || refreshToken)

    const isProtected = pathname === "/dashboard" || protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthPage = authRoutes.some((route) => pathname.startsWith(route))
    const isPasswordResetPage = passwordResetRoute.some((route) => pathname.startsWith(route))

    if (isProtected && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (isPasswordResetPage && !reset_token) {
        return NextResponse.redirect(new URL("/forgot-password", request.url))
    }

    const response = NextResponse.next()

    if (encoded && accessToken && refreshToken) {
        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 15,
        });
        response.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });
    }

    return response;
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/applications/:path*",
        "/contacts/:path*",
        "/analytics/:path*",
        "/settings/:path*",
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
        "/verify-email"
    ],
}
