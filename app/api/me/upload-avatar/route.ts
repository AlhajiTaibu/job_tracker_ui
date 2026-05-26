import { NextResponse } from "next/server"
import { serverProtectedApiFetch } from "@/lib/server-protected-api"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!(file instanceof File)) {
            return NextResponse.json({
                message: "Invalid file upload",
            }, { status: 400 })
        }
        const data = await serverProtectedApiFetch<{
            success?: boolean,
            error?: string
        }>(
            "profile/upload-avatar", {
            method: "POST",
            body: formData
        })
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Profile avatar upload failed" })
    }
}