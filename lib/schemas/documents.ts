import { z } from "zod";

export const uploadDocumentSchema = z.object({
    purpose: z.enum([
        "cv",
        "cover letter",
        "portfolio",
        "offer letter",
        "references",
        "other",
    ]),
    name: z.string().nullable().optional().default(null),
    is_draft: z.boolean().optional().default(false),
    is_base: z.boolean().optional().default(false),
    file: z
        .instanceof(File)
        .refine((file) => file.size > 0, "File is required")
        .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
});

export const editDocumentSchema = z.object({
    // purpose: z.enum([
    //     "cv",
    //     "cover letter",
    //     "portfolio",
    //     "offer letter",
    //     "references",
    //     "other",
    // ]),
    name: z.string().nullable().optional().default(null),
    is_draft: z.boolean().optional().default(false),
    is_base: z.boolean().optional().default(false),
    is_submitted: z.boolean().optional().default(false),
});

export type EditDocumentInput = z.infer<typeof editDocumentSchema>

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>