export type JobStatus = "applied" | "screening" | "assessment" | "interviewing" | "offer" | "rejected" | "saved" | "accepted" | "withdrawn" | "stale"

export type JobSource = "LinkedIn" | "Referral" | "Company Career Page" | "Job Board" | "Other"

export type DocumentType = "cv" | "cover_letter" | "portfolio" | "other"

export type ContactType = "recruiter" | "hiring manager" | "referral" | "employee" | "other"

export interface JobDocument {
  id: string
  name: string
  type: DocumentType
  size: number
  uploadedAt: string
  url: string
}

export interface NoteLog {
  id: string
  notes: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  name: string
  role?: string
  company?: string
  email?: string
  phone?: string
  linkedIn_url?: string
  relationship_type: ContactType
  notes?: NoteLog[]
  created_at?: string
  job_applications?: JobApplication[]
}
export interface ContactPayload {
  data?: Contact[]
}

export interface ContactResponse {
  success?: boolean
  payload: ContactPayload
  error?: string
}

export interface JobApplication {
  id: string
  company_name: string
  job_title: string
  description?: string
  status: JobStatus
  source: JobSource
  date_applied?: string
  notes?: string
  job_url?: string
  updated_at?: string
  documents?: JobDocument[]
  contacts?: Contact[]
}

export interface Payload {
  data?: JobApplication[]
}

export interface JobApplicationResponse {
  success?: boolean
  payload: Payload
  error?: string
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
  screening: {
    label: "Screening",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  assessment: {
    label: "Assessment",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  interviewing: {
    label: "Interview",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  offer: {
    label: "Offer",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  accepted: {
    label: "Accepted",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  rejected: {
    label: "Rejected",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
  stale: {
    label: "Stale",
    color: "text-brown-700",
    bgColor: "bg-brown-50",
  },
}

export interface Profile {
  id: string
  first_name?: string
  last_name?: string
  email: string
  title?: string
  notification_type?: string
  avatar_url?: string
}


export interface ProfilePayload {
  data?: Profile
}

export interface ProfileResponse {
  success?: boolean
  payload: ProfilePayload
  error?: string
}

export type DocumentStatus = "uploaded" | "processing" | "ready" | "failed";

export const documentsConfig: Record<
  DocumentStatus,
  { label: string; color: string; bgColor: string }
> = {
  uploaded: {
    label: "Uploaded",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  processing: {
    label: "Processing",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  ready: {
    label: "Ready",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  failed: {
    label: "Failed",
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
