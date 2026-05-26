import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function b64ToDict(b64String: string) {
  const jsonStr = Buffer.from(b64String, "base64").toString("utf-8");
  return JSON.parse(jsonStr);
}

export { cn, b64ToDict }