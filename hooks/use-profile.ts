import { create } from "zustand"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { ProfileResponse } from "@/lib/types"
import { useCallback } from "react"
import { useToast } from "./use-toast"

type ProfileInput = {
    first_name?: string
    last_name?: string
    title?: string
    notification_type?: string
}

const getProfile = async () => {
    const res = await fetch("/api/me/get")

    if (!res.ok) {
        const errorText = await res.statusText
        throw new Error(errorText || "Profile retrieval failed")
    }

    return res.json()
}


const updateProfile = async (data: ProfileInput) => {
    const res = await fetch("/api/me/update", {
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const errorText = await res.statusText
        throw new Error(errorText || "Profile update failed")
    }

    return res.json()
}


const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 60_000,
    })
}


const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ data }: { data: ProfileInput }) => updateProfile(data),

        onMutate: async ({ data }) => {
            const previousProfile = queryClient.getQueryData<ProfileResponse>(['profile'])

            queryClient.setQueryData(['profile'], (old: ProfileResponse) => {
                if (!old) return

                return {
                    ...old,
                    payload: {
                        ...old?.payload,
                        data: { ...old?.payload?.data, data }
                    }
                }
            })

            return { previousProfile }
        },

        onError: (_err, _vars, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData<ProfileResponse>(['profile'], context?.previousProfile)
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        }
    })
}

type ProfileUpdate = {
    isUpdating: boolean
    setIsUpdating: (val: boolean) => void
}


const useProfileStore = create<ProfileUpdate>((set) => ({
    isUpdating: false,
    setIsUpdating: (val) => set({ isUpdating: val })
}))

const useHandleUpdateProfile = () => {
    const { mutateAsync } = useUpdateProfile()
    const { toast } = useToast()

    const handleUpdateProfile = useCallback(async (data: ProfileInput) => {
        try {
            const result = await mutateAsync({ data })

            if (result?.error || result?.message.includes("error")) {
                throw new Error("Profile update failed")
            }

            toast({
                title: "Profile Update",
                description: "Profile updated successfully"
            })
        } catch {

            toast({
                title: "Profile Update Failed",
                description: "Profile update failed",
                variant: "destructive"
            })
        } finally {

        }

    }, [mutateAsync, toast])
    return { handleUpdateProfile }
}

export { getProfile, useProfile, useHandleUpdateProfile, useProfileStore }