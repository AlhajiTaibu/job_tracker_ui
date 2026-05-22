import { optional, z } from "zod";


export const addContactSchema = z.object({
    company: z.string().min(3, "Company name is required"),
    name: z.string().min(3, "Name of Contact is required"),
    role: z.string().optional().or(z.literal("")),
    linkedIn_url: z
        .string()
        .url({ message: "Invalid URL" })
        .optional()
        .or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    relationship_type: z.string(),
    notes: z.string().optional().or(z.literal("")),
    previous_notes: z.array(z.string()).optional(),
})


export type AddContactInput = z.infer<typeof addContactSchema>