import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            "job_application/create", {
            method: "POST",
            body: JSON.stringify(body)
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Job Application creation failed" })
    }
}