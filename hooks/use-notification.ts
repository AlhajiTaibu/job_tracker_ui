import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";
import { useEffect, useRef, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NotificationResponse } from "@/lib/types"

type BannerMessage = {
    id: string;
    title: string;
    message: string;
    created_at: string;
};

type NotificationInput = {
    token: string
    platform: string
}

const registerDevice = async (data: NotificationInput) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/notification/register-device`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    )

    if (!res.ok) {
        throw new Error("Notification device registration failed")
    }

    return res.json()
}

const fetchNotifications = async ({ cookieStore = {} as ReadonlyRequestCookies }: { cookieStore?: ReadonlyRequestCookies }) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/notification/notifications`,
        {
            headers: {
                cookie: cookieStore.toString(),
            }
        },
    )

    if (!res.ok) {
        throw new Error("Notifications retrieval failed")
    }

    return res.json()
}

const markNotificationAsRead = async (notification_id: string) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/notification/mark-as-read/${notification_id}`,
        {
            method: "PATCH"
        }
    )

    if (!res.ok) {
        throw new Error("Mark Notification read failed")
    }

    return res.json()
}


const markAllNotificationAsRead = async () => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/notification/mark-all-as-read/`,
        {
            method: "PATCH"
        }
    )

    if (!res.ok) {
        throw new Error("Mark Notifications read failed")
    }

    return res.json()
}


const deleteNotification = async (notification_id: string) => {
    const baseUrl = typeof window !== 'undefined'
        ? ''
        : process.env.NEXT_PUBLIC_SITE_URL
    const res = await fetch(`${baseUrl}/api/notification/delete/${notification_id}`,
        {
            method: "DELETE"
        }
    )

    if (!res.ok) {
        throw new Error("Delete Notification read failed")
    }

    return res.json()
}


const useRegisterDevice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: NotificationInput) => registerDevice(data),
    })
}

const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (notification_id: string) => markNotificationAsRead(notification_id),
        onMutate: async (notification_id) => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData<NotificationResponse>(["notifications"]);
            queryClient.setQueryData<NotificationResponse>(['notifications'], (old) => {
                if (!old) return old

                const updatedNotification = old.payload.data?.map((notification) => {
                    if (notification.id === notification_id) {
                        return {
                            ...notification,
                            is_read: true
                        }
                    }
                    return notification;
                }) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedNotification,
                    },
                }
            })
            return { previousNotifications }
        },
        onError: (err, variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })
}

const useMarkAllNotificationAsRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => markAllNotificationAsRead(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData<NotificationResponse>(["notifications"]);
            queryClient.setQueryData<NotificationResponse>(['notifications'], (old) => {
                if (!old) return old
                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.map((notification) => ({
                            ...notification,
                            is_read: true,
                        })) ?? []
                    },
                }
            })
            return { previousNotifications }
        },
        onError: (err, variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })
}

const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notification_id: string) => deleteNotification(notification_id),
        onMutate: async (notification_id) => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previousNotifications = queryClient.getQueryData<NotificationResponse>(["notifications"]);
            queryClient.setQueryData<NotificationResponse>(['notifications'], (old) => {
                if (!old) return old

                const updatedNotification = old.payload.data?.filter((notification) => notification.id !== notification_id) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedNotification,
                    },
                }
            })
            return { previousNotifications }
        },
        onError: (err, notification_id, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(["notifications"], context.previousNotifications);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    });
}

export const getNotificationsOptions = (
    cookieStore: ReadonlyRequestCookies = {} as ReadonlyRequestCookies) => ({
        queryKey: ["notifications"] as const,
        queryFn: () => fetchNotifications({ cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    });


const useNotifications = () => {
    return useQuery(getNotificationsOptions())
}


const useHandleRegisterDevice = () => {
    const { mutateAsync } = useRegisterDevice()
    const { toast } = useToast()


    const handleRegisterDevice = useCallback(
        async (data: NotificationInput) => {
            try {
                await mutateAsync(data)
                // toast({
                //     title: "Notification Device Registration",
                //     description: "Device Registration successful"
                // })
            } catch {
                toast({
                    title: "Notification Device Registration Failed",
                    description: "Device Registration failed",
                    variant: "destructive"
                })
            }
        },
        [mutateAsync, toast]
    )

    return { handleRegisterDevice }
}

const useHandleMarkNotificationAsRead = () => {
    const { mutateAsync } = useMarkNotificationAsRead()
    const { toast } = useToast()


    const handleMarkNotificationAsRead = useCallback(
        async (notification_id: string) => {
            try {
                await mutateAsync(notification_id)
                // toast({
                //     title: "Notification Device Registration",
                //     description: "Device Registration successful"
                // })
            } catch {
                toast({
                    title: "Mark Notification Read Failed",
                    description: "Mark Notification Read failed",
                    variant: "destructive"
                })
            }
        },
        [mutateAsync, toast]
    )

    return { handleMarkNotificationAsRead }
}

const useHandleMarkAllNotificationAsRead = () => {
    const { mutateAsync } = useMarkAllNotificationAsRead()
    const { toast } = useToast()


    const handleMarkAllNotificationAsRead = useCallback(
        async () => {
            try {
                await mutateAsync()
                // toast({
                //     title: "Notification Device Registration",
                //     description: "Device Registration successful"
                // })
            } catch {
                toast({
                    title: "Mark All Notification Read Failed",
                    description: "Mark All Notification Read failed",
                    variant: "destructive"
                })
            }
        },
        [mutateAsync, toast]
    )

    return { handleMarkAllNotificationAsRead }
}

const useHandleDeleteNotification = () => {
    const { mutateAsync } = useDeleteNotification()
    const { toast } = useToast()


    const handleDeleteNotification = useCallback(
        async (notification_id: string) => {
            try {
                await mutateAsync(notification_id)
            } catch {
                toast({
                    title: "Delete Notification Failed",
                    description: "Delete Notification failed",
                    variant: "destructive"
                })
            }
        },
        [mutateAsync, toast]
    )

    return { handleDeleteNotification }
}

function useNotificationBanner(timeout = 5000) {
    const [message, setMessage] = useState<BannerMessage | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!messaging) return
        const unsubscribe = onMessage(messaging, (payload) => {
            const nextMessage = {
                id: crypto.randomUUID(),
                title: payload.notification?.title || "Notification",
                message: payload.notification?.body || "",
                created_at: new Date().toISOString()
            };

            setMessage(nextMessage);

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setMessage(null);
            }, timeout);
        });

        return () => {
            unsubscribe();
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeout]);

    const dismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setMessage(null);
    };

    return { message, dismiss };
}

export {
    useNotifications,
    useHandleRegisterDevice,
    useNotificationBanner,
    useHandleMarkNotificationAsRead,
    useHandleMarkAllNotificationAsRead,
    useHandleDeleteNotification
}
