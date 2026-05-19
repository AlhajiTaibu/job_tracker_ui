import { JobApplicationResponse, JobApplication, JobSource, JobStatus } from "@/lib/types"
import { create } from "zustand"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";


type JobApplicationUpdateInput = {
    company_name: string
    job_title: string
    description?: string
    // status: JobStatus
    source: JobSource
    date_applied?: string
    notes?: string
    job_url?: string
}

const editJob = async (data: JobApplicationUpdateInput, id: string) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
                const result = await mutateAsync({ data, id })
                if (result?.success === false || result?.message.includes("Error")) {
                    throw new Error(result.error || "Job Application update failed")
                }
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

export { useEditJobStore, useHandleJobEdit }