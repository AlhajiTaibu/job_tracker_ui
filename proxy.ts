import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

    const isAuthenticated = !!(access_token || refresh_token)

    const isProtected = pathname === "/" || protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthPage = authRoutes.some((route) => pathname.startsWith(route))
    const isPasswordResetPage = passwordResetRoute.some((route) => pathname.startsWith(route))

    if (isProtected && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (isPasswordResetPage && !reset_token) {
        return NextResponse.redirect(new URL("/forgot-password", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
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
