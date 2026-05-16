"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanCard } from "@/components/kanban-card";
import type { JobApplication, JobStatus } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: JobStatus;
  title: string;
  color: string;
  jobs: JobApplication[];
  activeJob: JobApplication | null;
  onAddClick: (status: JobStatus) => void;
  onEditJob: (job: JobApplication) => void;
  onDeleteJob: (id: string) => void;
  onMoveJob: (id: string, newStatus: JobStatus) => void;
  canMove: (fromStatus: JobStatus, targetStatus: JobStatus) => boolean;
}

export function KanbanColumn({
  status,
  title,
  color,
  jobs,
  activeJob,
  onAddClick,
  onEditJob,
  onDeleteJob,
  onMoveJob,
  canMove,
}: KanbanColumnProps) {
  const isDroppable: boolean = activeJob
    ? canMove(activeJob.status, status)
    : true;
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled: !isDroppable,
  });

  return (
    <div className="flex w-full flex-col md:min-w-[260px] md:flex-1">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-medium text-muted-foreground">
            {jobs.length}
          </span>
        </div>
        {(status === "saved" || status === "applied") && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onAddClick(status)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2.5 rounded-lg p-2 md:flex-1 transition-colors",
          !isDroppable && "bg-red-50 ring-2 ring-red-300",
          isDroppable && "bg-muted/50",
          isDroppable && isOver && "ring-2 ring-primary/30 bg-primary/5",
        )}
      >
        {jobs.length === 0 && (status === "saved" || status === "applied") ? (
          <div className="flex flex-col items-center justify-center py-6 text-center md:flex-1 md:py-8">
            <p className="text-sm text-muted-foreground">No applications</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-primary hover:text-primary"
              onClick={() => onAddClick(status)}
            >
              <Plus className="mr-1 h-3 w-3" />
              Add one
            </Button>
          </div>
        ) : (
          jobs.map((job) => (
            <KanbanCard
              key={job.id}
              job={job}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
              onMove={onMoveJob}
            />
          ))
        )}
      </div>
    </div>
  );
}
