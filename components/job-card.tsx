"use client"

import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { JobApplication, JobStatus } from "@/lib/types"
import { statusConfig } from "@/lib/types"

interface JobCardProps {
  job: JobApplication
  onEdit: (job: JobApplication) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: JobStatus) => void
}

export function JobCard({ job, onEdit, onDelete, onStatusChange }: JobCardProps) {
  const status = statusConfig[job.status]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card p-5 transition-all hover:border-border hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg font-semibold text-secondary-foreground">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold text-foreground">
                {job.position}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                <span className="truncate text-sm">{job.company}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(job.appliedDate)}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          {job.notes && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {job.notes}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <Badge className={`${status.bgColor} ${status.color} border-0`}>
            {status.label}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(job)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {job.url && (
                <DropdownMenuItem asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Job Posting
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusChange(job.id, "saved")}
                disabled={job.status === "saved"}
              >
                Mark as Saved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(job.id, "applied")}
                disabled={job.status === "applied"}
              >
                Mark as Applied
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(job.id, "interview")}
                disabled={job.status === "interview"}
              >
                Mark as Interview
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(job.id, "offer")}
                disabled={job.status === "offer"}
              >
                Mark as Offer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange(job.id, "rejected")}
                disabled={job.status === "rejected"}
              >
                Mark as Rejected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(job.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
