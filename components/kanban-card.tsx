"use client";

import {
  Building2,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowRight,
  FileText,
  StickyNote,
  Paperclip,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JobApplication, JobStatus } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useJobStore } from "@/hooks/use-job-store";
import { useHandleMove, useMoveStore } from "@/hooks/use-move-job";
import { useHandleJobDelete } from "@/hooks/use-edit-job";

interface KanbanCardProps {
  job: JobApplication;
}

const allStatuses: {
  value: JobStatus;
  label: string;
  availableState: JobStatus[];
}[] = [
  { value: "saved", label: "Saved", availableState: ["applied", "withdrawn"] },
  {
    value: "applied",
    label: "Applied",
    availableState: [
      "screening",
      "assessment",
      "stale",
      "rejected",
      "withdrawn",
    ],
  },
  {
    value: "screening",
    label: "Screening",
    availableState: [
      "interviewing",
      "assessment",
      "stale",
      "rejected",
      "withdrawn",
    ],
  },
  {
    value: "interviewing",
    label: "Interview",
    availableState: ["offer", "assessment", "stale", "rejected", "withdrawn"],
  },
  {
    value: "offer",
    label: "Offer",
    availableState: ["accepted", "rejected", "withdrawn"],
  },
  { value: "rejected", label: "Rejected", availableState: [] },
  { value: "withdrawn", label: "Withdrawn", availableState: [] },
  { value: "accepted", label: "Accepted", availableState: [] },
  {
    value: "assessment",
    label: "Assessment",
    availableState: ["interviewing", "stale", "rejected", "withdrawn"],
  },
  { value: "stale", label: "Stale", availableState: ["withdrawn", "applied"] },
];

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

export function KanbanCard({ job }: KanbanCardProps) {
  const viewJob = useJobStore((state) => state.viewJob);
  const editJob = useJobStore((state) => state.editJob);
  const { handleJobDelete } = useHandleJobDelete();
  const { handleMove } = useHandleMove();
  const isMoving = useMoveStore((state) => !!state.movingIds[job.id]);

  const formattedDate = job.date_applied
    ? new Date(job.date_applied).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : new Date(job.updated_at as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(job.id),
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn("touch-none", {
        "pointer-events-none opacity-60": isMoving,
        "opacity-50 z-50": isDragging,
      })}
    >
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 text-sm font-semibold text-primary">
              {job.company_name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium text-foreground">
                {job.job_title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{job.company_name}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => editJob(job)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {job.job_url && (
                <DropdownMenuItem asChild>
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Posting
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={isMoving}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {allStatuses
                    .filter((s) => s.value === job.status)
                    .map((s) => s.availableState)
                    .flatMap((s) => s)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleMove(job.id, status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleJobDelete(job.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 rounded-md bg-secondary/50 px-1.5 py-0.5">
            {job.source && (
              <>
                <Globe className="h-3 w-3 shrink-0" />
                <span className="truncate">{job.source}</span>
              </>
            )}
          </div>
        </div>
        {job.description && (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-muted-foreground/80">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p className="line-clamp-2">{truncateText(job.description, 80)}</p>
          </div>
        )}

        {job.notes && (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-muted-foreground/80">
            <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p className="line-clamp-2">{truncateText(job.notes, 60)}</p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {formattedDate && (
                <>
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </>
              )}
            </div>
            {job.documents && job.documents.length > 0 && (
              <div className="flex items-center gap-1 text-primary/70">
                <Paperclip className="h-3 w-3" />
                <span>{job.documents.length}</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            onClick={() => viewJob(job)}
            className="text-xs text-primary/70 transition-colors hover:text-primary"
          >
            View job
          </button>
        </div>
      </Card>
    </div>
  );
}
