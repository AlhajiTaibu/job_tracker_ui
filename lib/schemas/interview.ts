import { optional, z } from "zod";


export const addInterviewSchema = z.object({
    round: z.number().optional().or(z.literal(0)),
    format: z.string().optional().or(z.literal("")),
    date: z.string().date().optional().or(z.literal("")),
    time: z.string().time().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    timezone: z.string().optional().or(z.literal("")),
    interviewer_name: z.string().optional().or(z.literal("")),
    estimated_duration: z.string().optional().or(z.literal("")),
    actual_duration: z.string().optional().or(z.literal("")),
    job_application: z.string()
})


export type AddInterviewInput = z.infer<typeof addInterviewSchema>