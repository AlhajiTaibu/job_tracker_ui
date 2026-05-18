import { z } from "zod";


export const addJobSchema = z.object({
    company_name: z.string().min(3, "Company name is required"),
    job_title: z.string().min(3, "Job title is required"),
    status: z.string().min(5, "Status is required"),
    source: z.string().min(5, "Source is required"),
    description: z.string(),
    notes: z.string(),
    job_url: z.string(),
    date_applied: z.string()
})


export type AddJobInput = z.infer<typeof addJobSchema>