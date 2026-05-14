"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/lib/types"

type AuthState = {
    user: User | null
    access_token: string | null
    refresh_token: string | null
    setAuth: (data: {
        user?: User | null
        access_token?: string | null
        refresh_token?: string | null
    }) => void
    clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            access_token: null,
            refresh_token: null,
            setAuth: ({ user, access_token, refresh_token }) =>
                set((state) => ({
                    user: user ?? state.user,
                    access_token: access_token ?? state.access_token,
                    refresh_token: refresh_token ?? state.refresh_token,
                })),
            clearAuth: () =>
                set({
                    user: null,
                    access_token: null,
                    refresh_token: null,
                }),
        }),
        { name: "auth-storage" }
    )
)
