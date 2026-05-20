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

type UploadAvatarResponse = {
    avatar_url: string
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
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/me/update`, {
        method: "POST",
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const errorText = await res.statusText
        throw new Error(errorText || "Profile update failed")
    }

    return res.json()
}

const uploadAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/me/upload-avatar", {
        body: formData,
        method: "POST"
    })

    if (!res.ok) {
        throw new Error("Failed to upload avatar")
    }

    return res.json()
}


const useUploadAvatar = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ file }: { file: File }) => uploadAvatar(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        }
    })
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
            console.log(result)
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


const useHandleUploadAvatar = () => {
    const { mutateAsync } = useUploadAvatar()
    const { toast } = useToast()

    const handleUploadAvatar = useCallback(
        async (file: File) => {
            try {
                const res = await mutateAsync({ file })
                if (res?.error || res?.message.includes("Error")) {
                    throw new Error("Avatar upload failed")
                }
                toast({
                    title: "Avatar Upload",
                    description: "Avatar uploaded successfully"
                })
            } catch {
                toast({
                    title: "Avatar Upload Failed",
                    description: "Avatar upload failed",
                    variant: "destructive"
                })
            }

        }, [mutateAsync, toast])

    return { handleUploadAvatar }
}

export { getProfile, useProfile, useHandleUpdateProfile, useProfileStore, useHandleUploadAvatar }