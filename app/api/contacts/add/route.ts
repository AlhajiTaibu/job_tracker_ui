import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverProtectedApiFetch<{ success?: string, error?: string }>(
            "contacts/create", {
            method: "POST",
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Contact creation failed" })
    }
}