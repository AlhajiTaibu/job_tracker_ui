import { JobApplicationResponse, JobApplication, JobSource, JobStatus } from "@/lib/types"
import { create } from "zustand"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";


type JobApplicationUpdateInput = {
    company_name: string
    job_title: string
    description?: string
    source: JobSource
    date_applied?: string
    notes?: string
    job_url?: string
}

const editJob = async (data: JobApplicationUpdateInput, id: string) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL

    const res = await fetch(`${baseUrl}/api/applications/update/${id}`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Job Application update failed")
    }

    return res.json()
}


const deleteJob = async (id: string) => {
    const res = await fetch(`/api/applications/delete/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error("Failed to delete Job Application")
    }

    return res.json()
}


const useEditJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data, id }: { data: JobApplicationUpdateInput, id: string }) => editJob(data, id),

        onMutate: async ({ data, id }) => {
            await queryClient.cancelQueries({ queryKey: ["jobs"] })
            const previousJobs = queryClient.getQueryData<JobApplicationResponse>(['jobs'])
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
            )

            queryClient.setQueryData<JobApplicationResponse>(['jobs'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old?.payload?.data?.map((app) =>
                            app.id === id ? { ...app, ...cleanedData } : app
                        ),
                    },
                }
            })

            return { previousJobs }
        },

        onError: (_err, _vars, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context?.previousJobs)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
    })
}

const useDeleteJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: string }) => deleteJob(id),

        onMutate: async ({ id }) => {
            const previousJobs = queryClient.getQueryData<JobApplicationResponse>(['jobs'])

            queryClient.setQueryData<JobApplicationResponse>(['jobs'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old?.payload?.data?.filter((app) =>
                            app.id !== id
                        ),
                    },
                }
            })
            return { previousJobs }
        },

        onError: (_err, _vars, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData<JobApplicationResponse>(['jobs'], context?.previousJobs)
            }
        },

        onSettled: () => {
            queryClient.cancelQueries({ queryKey: ['jobs'] })
        }
    })
}

type EditJob = {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
}

const useEditJobStore = create<EditJob>((set) => ({
    isSubmitting: false,
    setIsSubmitting: (value) => set({ isSubmitting: value })
}))


const useHandleJobEdit = () => {
    const { mutateAsync } = useEditJob()
    const setIsSubmitting = useEditJobStore((state) => state.setIsSubmitting)
    const { toast } = useToast()


    const handleJobEdit = useCallback(
        async (data: JobApplicationUpdateInput, id: string) => {
            setIsSubmitting(true)
            try {
                await mutateAsync({ data, id })
                toast({
                    title: "Job Application Update",
                    description: "Job Application updated"
                })
            } catch {
                toast({
                    title: "Job Application Update Failed",
                    description: "Job Application update failed",
                    variant: "destructive"
                })
            }
            finally {
                setIsSubmitting(false)
            }
        },
        [mutateAsync, setIsSubmitting, toast]
    )

    return { handleJobEdit }
}

const useHandleJobDelete = () => {
    const { mutateAsync } = useDeleteJob()
    const { toast } = useToast()

    const handleJobDelete = useCallback(async (id: string) => {
        try {
            await mutateAsync({ id })
            toast({
                title: "Job Application Deleted",
                description: "Job Application deleted successfully"
            })
        } catch {
            toast({
                title: "Job Application Deletion Failed",
                description: "Job Application deletion failed",
                variant: "destructive"
            })
        }

    }, [toast, mutateAsync])
    return { handleJobDelete }
}

export { useEditJobStore, useHandleJobEdit, useHandleJobDelete }