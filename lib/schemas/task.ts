import { z } from "zod";


export const addTaskSchema = z.object({
    name: z.string().min(3, "Task name is required"),
    task_type: z.string().min(5, "Task type is required"),
    due_date: z.string().date().optional().or(z.literal("")),
    job_application_id: z
        .string()
        .uuid({ message: "Invalid job application ID" })
        .optional()
        .or(z.literal("")),
})


export type AddTaskInput = z.infer<typeof addTaskSchema>