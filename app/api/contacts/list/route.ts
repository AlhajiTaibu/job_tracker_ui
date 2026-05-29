import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { ContactResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const { searchParams } = new URL(req.url)
        const queryString = searchParams.toString()
        const endpoint = queryString
            ? `contacts/list?${queryString}`
            : "contacts/list"
        const data = await serverProtectedApiFetch<ContactResponse>(
            endpoint, {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Contact List failed" }, { status: 400 })
    }
}