import { TaskResponse, TaskStatus, TaskType } from "@/lib/types";
import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


type TaskInput = {
    task_type: TaskType;
    due_date?: string;
    name: string;
    job_application_id?: string;
}

type TaskParams = {
    filters?: Record<string, string | number | boolean | undefined>
}

const fetchUpcomingTasks = async ({
    filters = {},
    cookieStore: ReadOnlyRequestCookies = {} as ReadonlyRequestCookies
}): Promise<TaskResponse> => {
    let res: Response
    if (typeof window === "undefined") {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/tasks/upcoming-tasks`, {
            headers: {
                cookie: cookieStore.toString(),
            },
        });
    } else {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`/api/tasks/upcoming-tasks?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    }

    if (!res.ok) {
        throw new Error("Upcoming tasks fetch failed");
    }
    return res.json();
};

const fetchOverdueTasks = async ({
    filters = {},
    cookieStore: ReadOnlyRequestCookies = {} as ReadonlyRequestCookies
}): Promise<TaskResponse> => {
    let res: Response
    if (typeof window === "undefined") {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/tasks/overdue-tasks`, {
            headers: {
                cookie: cookieStore.toString(),
            },
        });
    } else {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`/api/tasks/overdue-tasks?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    }

    if (!res.ok) {
        throw new Error("Overdue tasks fetch failed");
    }
    return res.json();
}

const fetchDailyTasks = async ({
    filters = {},
    cookieStore: ReadOnlyRequestCookies = {} as ReadonlyRequestCookies
}): Promise<TaskResponse> => {
    let res: Response
    if (typeof window === "undefined") {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/tasks/daily-tasks`, {
            headers: {
                cookie: cookieStore.toString(),
            },
        });
    } else {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`/api/tasks/daily-tasks?${params.toString()}`, {
            next: { revalidate: 60 },
        });
    }

    if (!res.ok) {
        throw new Error("Overdue tasks fetch failed");
    }
    return res.json();
}

const addTask = async (taskInput: TaskInput): Promise<TaskResponse> => {
    const data = Object.fromEntries(
        Object.entries({
            ...taskInput,
            job_application_id:
                taskInput.job_application_id === "" ? null : taskInput.job_application_id,
        }).filter(([_, value]) => value !== undefined && value !== "")
    );

    const res = await fetch(`/api/tasks/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Add task failed");
    }
    return res.json();
}

const editTask = async (taskId: string, taskInput: Partial<TaskInput>): Promise<TaskResponse> => {

    const res = await fetch(`/api/tasks/update/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskInput),
    });

    if (!res.ok) {
        throw new Error("Edit task failed");
    }
    return res.json();
}

const deleteTask = async (taskId: string) => {

    const res = await fetch(`/api/tasks/delete/${taskId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Delete task failed");
    }
    return res.json();
}

const completeTask = async (taskId: string) => {

    const res = await fetch(`/api/tasks/complete/${taskId}`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Complete task failed");
    }
    return res.json();
}

const snoozeTask = async (taskId: string, snoozeUntil: string) => {

    const res = await fetch(`/api/tasks/snooze/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ period: Number(snoozeUntil) }),
    });

    if (!res.ok) {
        throw new Error("Snooze task failed");
    }
    return res.json();
}

const cancelTask = async (taskId: string) => {

    const res = await fetch(`/api/tasks/cancel/${taskId}`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Cancel task failed");
    }
    return res.json();
}

// Custom hooks for fetching and mutating tasks with optimistic updates and error handling
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

const useEditTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, taskInput }: { taskId: string, taskInput: Partial<TaskInput> }) => editTask(taskId, taskInput),
        onMutate: async ({ taskId, taskInput }) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-tasks"] });
            const previousTasks = queryClient.getQueryData<TaskResponse>(["upcoming-tasks"]);
            queryClient.setQueryData<TaskResponse>(['upcoming-tasks'], (old) => {
                if (!old) return old

                const updatedTasks = old.payload.data?.map((task) => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            ...taskInput,
                        }
                    }
                    return task;
                }) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedTasks,
                    },
                }
            })
            return { previousTasks }
        },
        onError: (err, variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["upcoming-tasks"], context.previousTasks);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["overdue-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
        }
    });
}

const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-tasks"] });
            const previousTasks = queryClient.getQueryData<TaskResponse>(["upcoming-tasks"]);
            queryClient.setQueryData<TaskResponse>(['upcoming-tasks'], (old) => {
                if (!old) return old

                const updatedTasks = old.payload.data?.filter((task) => task.id !== taskId) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedTasks,
                    },
                }
            })
            return { previousTasks }
        },
        onError: (err, taskId, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["upcoming-tasks"], context.previousTasks);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["overdue-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
        }
    });
}

const useCompleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => completeTask(taskId),
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-tasks"] });
            const previousTasks = queryClient.getQueryData<TaskResponse>(["upcoming-tasks"]);
            queryClient.setQueryData<TaskResponse>(['upcoming-tasks'], (old) => {
                if (!old) return old

                const updatedTasks = old.payload.data?.map((task) => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            status: "completed" as TaskStatus,
                        }
                    }
                    return task;
                }) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedTasks,
                    },
                }
            })
            return { previousTasks }
        },
        onError: (err, taskId, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["upcoming-tasks"], context.previousTasks);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["overdue-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
        }
    });
}

const useSnoozeTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, snoozeUntil }: { taskId: string, snoozeUntil: string }) => snoozeTask(taskId, snoozeUntil),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["overdue-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
        }
    });
}

const useCancelTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => cancelTask(taskId),
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey: ["upcoming-tasks"] });
            const previousTasks = queryClient.getQueryData<TaskResponse>(["upcoming-tasks"]);
            queryClient.setQueryData<TaskResponse>(['upcoming-tasks'], (old) => {
                if (!old) return old

                const updatedTasks = old.payload.data?.map((task) => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            status: "cancelled" as TaskStatus,
                        }
                    }
                    return task;
                }) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedTasks,
                    },
                }
            })
            return { previousTasks }
        },
        onError: (err, taskId, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["upcoming-tasks"], context.previousTasks);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["upcoming-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["overdue-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["daily-tasks"] });
        }
    });
}

export const getUpcomingTasksQueryOptions = (
    filters: TaskParams["filters"] = {},
    cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies) => ({
        queryKey: ["upcoming-tasks", { filters }] as const,
        queryFn: () => fetchUpcomingTasks({ filters, cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });

export const getOverdueTasksQueryOptions = (
    filters: TaskParams["filters"] = {},
    cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies) => ({
        queryKey: ["overdue-tasks", { filters }] as const,
        queryFn: () => fetchOverdueTasks({ filters, cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });

export const getDailyTasksQueryOptions = (
    filters: TaskParams["filters"] = {},
    cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies) => ({
        queryKey: ["daily-tasks", { filters }] as const,
        queryFn: () => fetchDailyTasks({ filters, cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });


const useUpcomingTasks = ({ filters = {} }) => {
    return useQuery(getUpcomingTasksQueryOptions(filters))
};

const useOverdueTasks = ({ filters = {} }: TaskParams) => {
    return useQuery(getOverdueTasksQueryOptions(filters))
}

const useDailyTasks = ({ filters = {} }: TaskParams) => {
    return useQuery(getDailyTasksQueryOptions(filters))
}

// Zustand store for managing task form state
interface AddTaskStore {
    isSubmitting: boolean;
    setSubmitting: (isSubmitting: boolean) => void;
}

const useAddTaskStore = create<AddTaskStore>((set) => ({
    isSubmitting: false,
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));


// Custom hooks for handling task actions with toast notifications
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

const useHandleEditTask = () => {
    const { mutateAsync: editTaskAsync } = useEditTask();
    const { toast } = useToast();

    const handleEditTask = useCallback(async ({ taskId, updatedFields }: { taskId: string; updatedFields: Partial<TaskInput> }) => {
        try {
            await editTaskAsync({ taskId, taskInput: updatedFields });
            toast({
                title: "Success",
                description: "Task updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task",
                variant: "destructive",
            });
        }
    }, [editTaskAsync, toast]);

    return { handleEditTask };
}

const useHandleDeleteTask = () => {
    const { mutateAsync: deleteTaskAsync } = useDeleteTask();
    const { toast } = useToast();

    const handleDeleteTask = useCallback(async (taskId: string) => {
        try {
            await deleteTaskAsync(taskId);
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete task",
                variant: "destructive",
            });
        }
    }, [deleteTaskAsync, toast]);

    return { handleDeleteTask };
}

const useHandleCompleteTask = () => {
    const { mutateAsync: completeTaskAsync } = useCompleteTask();
    const { toast } = useToast();

    const handleCompleteTask = useCallback(async (taskId: string) => {
        try {
            await completeTaskAsync(taskId);
            toast({
                title: "Success",
                description: "Task marked as completed",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to complete task",
                variant: "destructive",
            });
        }
    }, [completeTaskAsync, toast]);

    return { handleCompleteTask };
}

const useHandleSnoozeTask = () => {
    const { mutateAsync: snoozeTaskAsync } = useSnoozeTask();
    const { toast } = useToast();

    const handleSnoozeTask = useCallback(async (taskId: string, snoozeUntil: string) => {
        try {
            await snoozeTaskAsync({ taskId, snoozeUntil });
            toast({
                title: "Success",
                description: "Task snoozed successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to snooze task",
                variant: "destructive",
            });
        }
    }, [snoozeTaskAsync, toast]);

    return { handleSnoozeTask };
}

const useHandleCancelTask = () => {
    const { mutateAsync: cancelTaskAsync } = useCancelTask();
    const { toast } = useToast();

    const handleCancelTask = useCallback(async (taskId: string) => {
        try {
            await cancelTaskAsync(taskId);
            toast({
                title: "Success",
                description: "Task cancelled successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cancel task",
                variant: "destructive",
            });
        }
    }, [cancelTaskAsync, toast]);

    return { handleCancelTask };
}

export {
    useUpcomingTasks,
    useOverdueTasks,
    useDailyTasks,
    useHandleAddTask,
    useHandleEditTask,
    useHandleDeleteTask,
    useHandleCompleteTask,
    useHandleSnoozeTask,
    useHandleCancelTask
}