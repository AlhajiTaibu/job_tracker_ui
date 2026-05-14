"use client"

import { Bookmark, Send, MessageSquare, Trophy, XCircle } from "lucide-react"
import type { JobApplication, JobStatus } from "@/lib/types"

interface StatsCardsProps {
  applications: JobApplication[]
  selectedStatus: JobStatus | "all"
  onStatusSelect: (status: JobStatus | "all") => void
}

const stats: {
  status: JobStatus | "all"
  label: string
  icon: React.ElementType
  gradient: string
  iconColor: string
}[] = [
  {
    status: "all",
    label: "Total",
    icon: Send,
    gradient: "from-slate-500 to-slate-600",
    iconColor: "text-slate-600",
  },
  {
    status: "saved",
    label: "Saved",
    icon: Bookmark,
    gradient: "from-slate-400 to-slate-500",
    iconColor: "text-slate-500",
  },
  {
    status: "applied",
    label: "Applied",
    icon: Send,
    gradient: "from-blue-500 to-blue-600",
    iconColor: "text-blue-600",
  },
  {
    status: "interview",
    label: "Interview",
    icon: MessageSquare,
    gradient: "from-amber-500 to-amber-600",
    iconColor: "text-amber-600",
  },
  {
    status: "offer",
    label: "Offers",
    icon: Trophy,
    gradient: "from-emerald-500 to-emerald-600",
    iconColor: "text-emerald-600",
  },
  {
    status: "rejected",
    label: "Rejected",
    icon: XCircle,
    gradient: "from-rose-500 to-rose-600",
    iconColor: "text-rose-600",
  },
]

export function StatsCards({
  applications,
  selectedStatus,
  onStatusSelect,
}: StatsCardsProps) {
  const getCount = (status: JobStatus | "all") => {
    if (status === "all") return applications.length
    return applications.filter((app) => app.status === status).length
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const count = getCount(stat.status)
        const isSelected = selectedStatus === stat.status
        const Icon = stat.icon

        return (
          <button
            key={stat.status}
            onClick={() => onStatusSelect(stat.status)}
            className={`group relative overflow-hidden rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-lg ${
              isSelected
                ? "border-primary/30 ring-2 ring-primary/20"
                : "border-border/50 hover:border-border"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                  {count}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} opacity-90`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            {isSelected && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50" />
            )}
          </button>
        )
      })}
    </div>
  )
}
