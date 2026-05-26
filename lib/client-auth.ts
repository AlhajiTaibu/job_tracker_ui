async function clientPost<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new Error(data?.message || "Request failed")
    }

    return data as T
}


async function clientGet<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new Error(data?.message || "Request failed")
    }

    return data as T
}

export {clientGet, clientPost}
