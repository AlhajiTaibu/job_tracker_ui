const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        cache: "no-store",
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new Error(data?.message || "Request failed")
    }

    return data as T
}