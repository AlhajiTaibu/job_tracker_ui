import { TaskResponse, TaskStatus, TaskType } from "@/lib/types";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";


type TaskInput = {
    task_type: TaskType;
    due_date?: string;
    name: string;
    job_application_id: string;
}


const fetchUpcomingTasks = async (): Promise<TaskResponse> => {

    const res = await fetch(`/api/tasks/upcoming-tasks`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Upcoming tasks fetch failed");
    }
    return res.json();
};

const fetchOverdueTasks = async (): Promise<TaskResponse> => {

    const res = await fetch(`/api/tasks/overdue-tasks`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Overdue tasks fetch failed");
    }
    return res.json();
}

const fetchDailyTasks = async (): Promise<TaskResponse> => {

    const res = await fetch(`/api/tasks/daily-tasks`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Overdue tasks fetch failed");
    }
    return res.json();
}

const addTask = async (taskInput: TaskInput): Promise<TaskResponse> => {

    const res = await fetch(`/api/tasks/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskInput),
    });

    if (!res.ok) {
        throw new Error("Add task failed");
    }
    return res.json();
}

const useAddTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addTask,
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-tasks"] });

            const previousTasks = queryClient.getQueryData<TaskResponse>(["upcoming-tasks"]);
            queryClient.setQueryData<TaskResponse>(['upcoming-tasks'], (old) => {
                if (!old) return old

                const optimisticTask = {
                    id: crypto.randomUUID(),
                    name: newTask.name,
                    status: "pending" as TaskStatus,
                    due_date: newTask.due_date || new Date().toISOString(),
                    job_application_id: newTask.job_application_id,
                    task_type: newTask.task_type,
                    created_at: new Date().toISOString(),
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: [...(old.payload.data ?? []), optimisticTask],
                    },
                }
            })
            return { previousTasks }
        },
        onError: (err, newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["upcoming-tasks"], context.previousTasks);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
        }
    });
}

const useUpcomingTasks = () => {
    return useQuery({
        queryKey: ["upcoming-tasks"],
        queryFn: fetchUpcomingTasks,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });
};

const useOverdueTasks = () => {
    return useQuery({
        queryKey: ["overdue-tasks"],
        queryFn: fetchOverdueTasks,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });
}

const useDailyTasks = () => {
    return useQuery({
        queryKey: ["daily-tasks"],
        queryFn: fetchDailyTasks,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });
}


interface AddTaskStore {
    isSubmitting: boolean;
    setSubmitting: (isSubmitting: boolean) => void;
}

const useAddTaskStore = create<AddTaskStore>((set) => ({
    isSubmitting: false,
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));


const useHandleAddTask = () => {
    const { mutateAsync: addTaskAsync } = useAddTask();
    const { toast } = useToast();
    const setIsSubmitting = useAddTaskStore((state) => state.setSubmitting);

    const handleAddTask = useCallback(async (newTask: TaskInput) => {
        try {
            setIsSubmitting(true);
            await addTaskAsync(newTask);
            toast({
                title: "Success",
                description: "Task added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add task",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [addTaskAsync, toast, setIsSubmitting]);

    return { handleAddTask };
}

export { useUpcomingTasks, useOverdueTasks, useDailyTasks, useHandleAddTask }