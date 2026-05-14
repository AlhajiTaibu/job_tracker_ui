import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .max(100, "Password is too long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export const loginSchema = z.object({
    username: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export const confirmEmailSchema = z.object({
    token: z.string().max(6, "Token must be 6 characters").min(6, "Token must be 6 characters"),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email("Valid email is required"),
})

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters")
            .max(100, "Password is too long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Sets the error to the confirmPassword field
    });

export const refreshTokenSchema = z.object({
    refresh_token: z.string().nonempty("Refresh token is required"),
})

export const logoutSchema = z.object({
    refresh_token: z.string().nonempty("Refresh token is required"),
})

export const verifyResetTokenSchema = z.object({
    email: z.string().email("Valid email is required"),
    token: z.string().max(6, "Token must be 6 characters").min(6, "Token must be 6 characters"),
})

export const resendOtpSchema = z.object({
    email: z.string().email("Valid email is required"),
})


export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ConfirmEmailInput = z.infer<typeof confirmEmailSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type LogoutInput = z.infer<typeof logoutSchema>
export type VerifyResetTokenInput = z.infer<typeof verifyResetTokenSchema>
export type ResendOtpInput = z.infer<typeof resendOtpSchema>


