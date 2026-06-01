import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Interview } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function b64ToDict(b64String: string) {
  const jsonStr = Buffer.from(b64String, "base64").toString("utf-8");
  return JSON.parse(jsonStr);
}

function getStatusClasses(status?: string | null) {
  const value = status?.toLowerCase();

  switch (value) {
    case "applied":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "screening":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "interviewing":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "offer":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    case "saved":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "assessment":
      return "border-slate-200 bg-orange-100 text-slate-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getInterviewOutcomeClasses(outcome?: string | null) {
  const value = outcome?.toLowerCase();

  switch (value) {
    case "passed":
      return "border-green-200 bg-green-50 text-green-700";
    case "waiting":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "withdrawn":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "pending":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    case "scheduled":
      return "border-blue-200 bg-blue-100 text-blue-700";
    case "no feedback":
      return "border-slate-200 bg-orange-100 text-slate-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

const interviewFormatConfig = {
  phone: {
    label: "Phone",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  "system design": {
    label: "System Design",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  "case study": {
    label: "Case Study",
    className:
      "bg-purple-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  "pair programming": {
    label: "Pair Programming",
    className:
      "bg-purple-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  panel: {
    label: "Panel",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  technical: {
    label: "Technical",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  video: {
    label: "Video",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  behavioural: {
    label: "Behavioural",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  onsite: {
    label: "Onsite",
    className:
      "bg-green-100 text-voilet-700 dark:bg-voilet-950 dark:text-voilet-300",
  }
};

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

const formatInterviewDate = (interview?: Interview) => {
  const raw = interview?.date;
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export { cn, b64ToDict, getStatusClasses, formatInterviewDate, truncateText, interviewFormatConfig, getInterviewOutcomeClasses }