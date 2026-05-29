import { JobApplicationResponse, JobApplication, JobSource, JobStatus } from "@/lib/types"
import { create } from "zustand"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";


type JobApplicationInput = {
    company_name: string
    job_title: string
    description?: string
    status: JobStatus
    source: JobSource
    date_applied?: string
    notes?: string
    job_url?: string
}

const addJob = async (data: JobApplicationInput) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/applications/add`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        throw new Error("Job Application creation failed")
    }

    return res.json()
}


const useAddJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: JobApplicationInput) => addJob(data),

        onMutate: async (newJob) => {
            await queryClient.cancelQueries({ queryKey: ["jobs"] })
            const previousJobs = queryClient.getQueryData<JobApplicationResponse>(['jobs'])

            queryClient.setQueryData<JobApplicationResponse>(['jobs'], (old) => {
                if (!old) return old

                const optimisticJob = {
                    ...newJob,
                    id: crypto.randomUUID(),
                    created_at: new Date().toISOString()
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: [...(old.payload.data ?? []), optimisticJob],
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

type AddJob = {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
}

const useAddJobStore = create<AddJob>((set) => ({
    isSubmitting: false,
    setIsSubmitting: (value) => set({ isSubmitting: value })
}))


const useHandleJobAdd = () => {
    const { mutateAsync } = useAddJob()
    const setIsSubmitting = useAddJobStore((state) => state.setIsSubmitting)
    const { toast } = useToast()


    const handleJobAdd = useCallback(
        async (data: JobApplicationInput) => {
            setIsSubmitting(true)
            try {
                await mutateAsync(data)
                toast({
                    title: "Job Application Creation",
                    description: "New Job Application added"
                })
            } catch {
                toast({
                    title: "Job Application Creation Failed",
                    description: "New Job Application addition failed",
                    variant: "destructive"
                })
            }
            finally {
                setIsSubmitting(false)
            }
        },
        [mutateAsync, setIsSubmitting, toast]
    )

    return { handleJobAdd }
}

export { useAddJobStore, useHandleJobAdd }