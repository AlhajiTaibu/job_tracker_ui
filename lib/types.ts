export type JobStatus = "applied" | "screening" | "assessment" | "interviewing" | "offer" | "rejected" | "saved" | "accepted" | "withdrawn" | "stale"

export type JobSource = "LinkedIn" | "Referral" | "Company Career Page" | "Job Board" | "Other"

export type DocumentPurpose = "cv" | "cover letter" | "portfolio" | "offer letter" | "references" | "other"

export type ContactType = "recruiter" | "hiring manager" | "referral" | "employee" | "other"

export interface JobDocument {
  id: string
  name: string
  type: DocumentPurpose
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
  updated_at?: string
  job_applications?: JobApplication[]
}
export interface ContactPayload {
  data?: Contact[]
  next_cursor?: string | null
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
  documents?: Document[]
  contacts?: Contact[]
}

export interface Payload {
  data?: JobApplication[]
  next_cursor?: string | null
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


export interface ProfileResponse {
  success?: boolean
  payload: Profile
  error?: string
}

export type DocumentStatus = "completed" | "pending" | "ready" | "failed";

export const documentsConfig: Record<
  DocumentPurpose,
  { label: string; color: string; bgColor: string }
> = {
  cv: {
    label: "CV / Resume",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  "cover letter": {
    label: "Cover Letter",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  portfolio: {
    label: "Portfolio",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  references: {
    label: "References",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  "offer letter": {
    label: "Offer Letter",
    color: "text-voilet-700",
    bgColor: "bg-voilet-50",
  },
  other: {
    label: "Other",
    color: "text-slate-700",
    bgColor: "bg-slate-50",
  },
}

export interface JobApplicationResponseTruncated {
  id: string
  company_name: string
  job_title: string
  status: string
}


export interface Document {
  id: string
  name?: string
  file_type: string
  purpose: DocumentPurpose
  status: DocumentStatus
  filename?: string
  size: number
  is_base: boolean
  is_draft: boolean
  is_submitted?: boolean
  job_applications?: JobApplicationResponseTruncated[]
  created_at: string
}

export interface DocumentPayload {
  data?: Document[]
}

export interface DocumentResponse {
  success?: boolean
  payload: DocumentPayload
  error?: string
}

export interface ApplicationFunnelResponse {
  count_applications_sent: number
  count_offers_received: number
  count_responses: number
  response_rate: number
  interview_to_offer_rate: number
  count_completed_interviews: number
  applied_to_screening?: AppliedToScreeningResponse
  screening_to_interview?: ScreeningToInterviewResponse
  interview_to_offer?: InterviewToOfferResponse,
  offer_to_accepted?: OfferToAcceptedResponse
}

export interface AppliedToScreeningResponse {
  applied_count: number
  screened_count: number
  rate: string
}

export interface ScreeningToInterviewResponse {
  interviewed_count: number
  rate: string
}

export interface InterviewToOfferResponse {
  offers_count: number
  rate: string
}

export interface OfferToAcceptedResponse {
  accepted_count: number
  rate: string
}


export interface HealthViewAnalyticsResponse {
  normal_progress_job_applications: Array<{ id: string }>
  staled_job_applications: Array<{ id: string, status: JobStatus, stale_period: number }>
  upcoming_tasks: number,
  overdue_tasks: number
}

export interface TimeInStageResponse {
  average_time_applied_to_screening: number,
  average_time_screening_to_interview: number,
  average_time_interview_to_offer: number
}

export interface WeeklyActivityResponse {
  week_number: number
  week_period: string
  application_count: number
}


export interface SourceDetails {
  applied_count: number,
  screened_count: number,
  interviewed_count: number,
  offers_count: number,
  response_count: number,
  accepted_count: number,
  applied_to_screening_rate: number,
  screening_to_interview_rate: number,
  interviewed_to_offer_rate: number,
  offer_to_accepted_rate: number,
  response_rate: number
}

export type SourceAnalyticsResponse = Record<string, SourceDetails>

export type RoleAnalyticsResponse = Record<string, SourceDetails>

export interface FollowUpAnalyticsResponse {
  followed_up_job_response_rate: number
  unfollowed_up_job_response_rate: number
}

export interface InterviewDetails {
  total_interviews: number
  passed: number
  passed_percentage: number
}

export type InterviewAnalyticsResponse = Record<string, InterviewDetails>


export type InterviewFormat = "phone" | "video" | "onsite" | "technical" | "system design" | "behavioural" | "case study" | "pair programming" | "panel"

export type InterviewOutcome = "scheduled" | "pending" | "passed" | "rejected" | "waiting" | "withdrawn" | "no feedback"

export interface Interview {
  id: string,
  company_name: string
  job_title: string
  format: InterviewFormat
  round: number
  outcome: InterviewOutcome
  date?: string
  time?: string
  created_at: string
  interviewer_name?: string
  notes?: string
  timezone?: string
  estimated_duration?: string
  actual_duration?: string
  job_application_id: string
}

export interface InterviewTruncated {
  id: string
  user_id: string
  company_name: string
  job_title: string
  format: InterviewFormat
  round: number
  outcome: InterviewOutcome
  date: string
  time: string
}

export interface InterviewPayload {
  data?: Interview[]
  next_cursor?: string | null
}

export interface InterviewResponse {
  success?: boolean
  payload: InterviewPayload
  error?: string
}

export const interviewFormatType: Record<
  InterviewFormat,
  { label: string; color: string; bgColor: string }
> = {
  phone: {
    label: "Phone",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
  video: {
    label: "Video",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  onsite: {
    label: "Onsite",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  technical: {
    label: "Technical",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  "system design": {
    label: "System Design",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  behavioural: {
    label: "Behavioural",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  "case study": {
    label: "Case Study",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  panel: {
    label: "Panel",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
  },
  "pair programming": {
    label: "Pair Programming",
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
}

export const interviewOutcomeType: Record<
  InterviewOutcome,
  { label: string; color: string; bgColor: string }
> = {
  scheduled: {
    label: "Scheduled",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
  pending: {
    label: "Pending",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  passed: {
    label: "Passed",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  rejected: {
    label: "Rejected",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  waiting: {
    label: "Waiting",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  "no feedback": {
    label: "No Feedback",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
}

export type TaskStatus = "pending" | "completed" | "snoozed" | "cancelled"

export type TaskType = "follow_up" | "confirm" | "reminder" | "thank_you" | "review" | "other"

export const taskStatusType: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  snoozed: {
    label: "Snoozed",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
};

export const taskTypeConfig: Record<
  TaskType,
  { label: string; color: string; bgColor: string }
> = {
  follow_up: {
    label: "Follow Up",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  thank_you: {
    label: "Thank You",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  confirm: {
    label: "Confirmation",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  reminder: {
    label: "Reminder",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  review: {
    label: "Review",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  other: {
    label: "Other",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export interface Task {
  id: string
  job_application_id?: string
  name: string
  status: TaskStatus
  task_type: TaskType
  due_date?: string
  is_overdue?: boolean
  created_at: string
  updated_at?: string
}

export interface TaskPayload {
  data?: Task[]
  next_cursor?: string | null
}

export interface TaskResponse {
  success?: boolean
  payload: TaskPayload
  error?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface NotificationPayload {
  data?: Notification[]
  next_cursor?: string | null
}

export interface NotificationResponse {
  success?: boolean
  payload: NotificationPayload
  error?: string
}