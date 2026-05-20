import { getAuthCookies, setAuthCookies, clearAuthCookies } from "./auth-cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function serverProtectedApiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const { access_token, refresh_token, reset_token } = await getAuthCookies()

    const doFetch = async (token?: string) => {
        const headers = new Headers(options.headers)
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }

        if (!(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json")
        } else {
            headers.delete("Content-Type")
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`, {
            ...options,
            headers,
            cache: "no-store",
        })

        const data = await res.json().catch(() => ({}))
        return { res, data }
    }

    let { res, data } = await doFetch(access_token || reset_token || undefined)

    if (res.status === 401 && refresh_token) {
        const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token }),
            cache: "no-store",
        })

        const refreshData = await refreshRes.json().catch(() => ({}))

        if (refreshRes.ok && refreshData.access_token) {
            await setAuthCookies({
                access_token: refreshData.access_token,
                refresh_token: refreshData.refresh_token || refresh_token,
            })

            const retry = await doFetch(refreshData.access_token)
            res = retry.res
            data = retry.data
        } else {
            await clearAuthCookies()
            throw new Error(refreshData?.message || "Session expired, please log")
        }
    }

    if (!res.ok) {
        throw new Error(data?.message || data?.detail || "Protected request failed")
    }
    return data as T
}