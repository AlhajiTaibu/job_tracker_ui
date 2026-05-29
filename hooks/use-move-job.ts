import { JobStatus, JobApplicationResponse, JobApplication, Payload } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from 'zustand'
import { useCallback } from 'react'
import { useToast } from "./use-toast";


const moveJob = async (id: string, status: JobStatus) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const job_id = id
    const res = await fetch(`${baseUrl}/api/applications/move/${job_id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to_status: status,
            reason: "Move job to next status"
        })
    })
    if (!res.ok) {
        throw new Error("Failed to move job application")
    }
    return res.json()
}

type MoveState = {
    movingIds: Record<string, boolean>
    setMoving: (id: string, value: boolean) => void
}


const useMoveJob = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: JobStatus }) => moveJob(id, status),

        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })

            const previousJobs = queryClient.getQueryData<JobApplicationResponse>(['jobs'])

            queryClient.setQueryData<JobApplicationResponse>(['jobs'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old?.payload?.data?.map((app) =>
                            app.id === id ? { ...app, status } : app
                        ),
                    },
                }
            })

            return { previousJobs }

        },

        onError: (_err, _vars, context) => {
            if (context?.previousJobs) {
                queryClient.setQueryData(['jobs'], context.previousJobs)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        }
    })
}

const useMoveStore = create<MoveState>((set) => ({
    movingIds: {},
    setMoving: (id, value) => set((state) => ({
        movingIds: {
            ...state.movingIds,
            [id]: value
        }
    })),
}))



const useHandleMove = () => {
    const { mutateAsync } = useMoveJob()
    const setMoving = useMoveStore((state) => state.setMoving)
    const { toast } = useToast()

    const handleMove = useCallback(
        async (id: string, status: JobStatus) => {
            setMoving(id, true)
            try {
                await mutateAsync({ id, status })
                toast({
                    title: "Job moved",
                    description: `Moved to ${status}`
                })
            } catch {
                toast({
                    title: "Move failed",
                    description: "Could not move application",
                    variant: "destructive"
                })
            }
            finally {
                setMoving(id, false)
            }
        },
        [mutateAsync, setMoving, toast]
    )

    return { handleMove }
}


export { useMoveStore, useMoveJob, useHandleMove }