import { z } from "zod";

const dateTimeLocalSchema = z.string().regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    "Invalid datetime"
);
export const addTaskSchema = z.object({
    name: z.string().min(3, "Task name is required"),
    task_type: z.string().min(5, "Task type is required"),
    due_date: dateTimeLocalSchema.optional().or(z.literal("")),
    job_application_id: z
        .string()
        .uuid({ message: "Invalid job application ID" })
        .optional()
        .or(z.literal("")),
})


export type AddTaskInput = z.infer<typeof addTaskSchema>