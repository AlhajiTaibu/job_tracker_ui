import { AnyARecord } from "node:dns";

export async function serverApiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const contentType = endpoint == "auth/login" ? "application/x-www-form-urlencoded" : "application/json"
    const res = await fetch(`${baseUrl}/api/v1/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": contentType,
            ...(options.headers || {}),
        },
        cache: "no-store",
    })

    const data = await res.json().catch(() => { })

    if (!res.ok) {
        throw new Error(data?.message || data?.detail || "Request failed")
    }

    return data as T
}