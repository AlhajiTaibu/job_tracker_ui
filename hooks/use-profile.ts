import { create } from "zustand"
import { useQueryClient, useQuery, useMutation, queryOptions } from "@tanstack/react-query"
import { ProfileResponse } from "@/lib/types"
import { useCallback } from "react"
import { useToast } from "./use-toast"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

type ProfileInput = {
    first_name?: string
    last_name?: string
    title?: string
    notification_type?: string
}

type UploadAvatarResponse = {
    avatar_url: string
}

const getProfile = async (cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies): Promise<ProfileResponse> => {
    let res: Response
    if (typeof window === 'undefined') {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/me/get`, {
            headers: {
                cookie: cookieStore.toString(),
            },
            // next: { revalidate: 60 },
        });
    } else {
        res = await fetch("/api/me/get")
    }


    if (!res.ok) {
        const error: any = new Error("Failed to fetch profile")
        error.status = res.status
        throw error
    }

    return res.json()
}


const updateProfile = async (data: ProfileInput) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL

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

export const getProfileQueryOptions = (cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies) => queryOptions({
    queryKey: ['profile'] as const,
    queryFn: () => getProfile(cookieStore),
    retry: (failureCount, error: any) => {
        const status = error?.status || error?.response?.status
        if (status === 401 || status === 400) return false
        return failureCount < 2
    },
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
})

const useProfile = () => {
    return useQuery(getProfileQueryOptions())
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
                        data: { ...old?.payload, data }
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
            await mutateAsync({ data })
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
                await mutateAsync({ file })
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