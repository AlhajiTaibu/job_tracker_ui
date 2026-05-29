import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export { cn, b64ToDict, getStatusClasses }