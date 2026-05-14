export type JobStatus = "applied" | "interview" | "offer" | "rejected" | "saved"

export type DocumentType = "cv" | "cover_letter" | "portfolio" | "other"

export interface JobDocument {
  id: string
  name: string
  type: DocumentType
  size: number
  uploadedAt: string
  url: string
}

export interface JobApplication {
  id: string
  company: string
  position: string
  location: string
  salary?: string
  status: JobStatus
  appliedDate: string
  notes?: string
  url?: string
  documents?: JobDocument[]
}

export const statusConfig: Record<
  JobStatus,
  { label: string; color: string; bgColor: string }
> = {
  saved: {
    label: "Saved",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
  applied: {
    label: "Applied",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  interview: {
    label: "Interview",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  offer: {
    label: "Offer",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  rejected: {
    label: "Rejected",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
  },
}


export type User = {
  id?: string
  email: string
}

export type AuthTokens = {
  access_token: string
  refresh_token?: string
}

export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
}

export type ConfirmEmailPayload = {
  email: string
  token: string
}

export type ResendOtpPayload = {
  email: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type RefreshTokenPayload = {
  refresh_token: string
}

export type AuthResponse = {
  success: boolean
  message?: string
  access_token?: string
  refresh_token?: string
  token_type: string
  user_id?: string
}

export type RegisterResponse = {
  success: boolean
  message: string
  expires_in?: string
}

export type ForgotPasswordResponse = {
  success: boolean
  message: string
}

export type VerifyResetTokenResponse = {
  success: boolean
  reset_token: string
}

export type RefreshTokenResponse = {
  message?: string
  access_token: string
  token_type: string
}
