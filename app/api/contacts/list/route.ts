import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"
import { ContactResponse } from "@/lib/types"


export async function GET(req: Request, options: RequestInit = {}) {
    try {
        const data = await serverProtectedApiFetch<ContactResponse>(
            "contacts/list", {
            method: "GET",
            ...(options || {})
        }
        )
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Contact List failed" }, { status: 400 })
    }
}