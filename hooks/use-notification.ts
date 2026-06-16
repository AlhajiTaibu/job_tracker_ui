import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";
import { useEffect, useRef, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

type BannerMessage = {
    id: number;
    title: string;
    body: string;
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


const useRegisterDevice = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: NotificationInput) => registerDevice(data),
    })
}


export const useHandleRegisterDevice = () => {
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


export function useNotificationBanner(timeout = 5000) {
    const [message, setMessage] = useState<BannerMessage | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!messaging) return
        const unsubscribe = onMessage(messaging, (payload) => {
            const nextMessage = {
                id: Date.now(),
                title: payload.notification?.title || "Notification",
                body: payload.notification?.body || "",
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
