"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock3,
  FileText,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { useJob, useJobs } from "@/hooks/use-jobs";
import { useMemo } from "react";

type TaskStatus = string;
type TaskType = string;

type Task = {
  id: string;
  job_application_id?: string;
  name: string;
  status: TaskStatus;
  task_type: TaskType;
  due_date?: string;
  is_overdue?: boolean;
  created_at: string;
  updated_at?: string;
};

interface ViewTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  jobApplicationTitle?: string;
}

const formatDate = (date?: string) => {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusStyles = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "snoozed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getTypeStyles = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "reminder":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "review":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "follow_up":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "confirm":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "thank_you":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

function InfoCard({
  icon,
  label,
  value,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <span className="size-4">{icon}</span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>
      <div className={`text-sm font-medium text-foreground ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}

export default function ViewTaskModal({
  open,
  onOpenChange,
  task,
}: ViewTaskModalProps) {
  const { data: jobsData } = useJobs({});

  const { jobTitle, company } = useMemo(() => {
    const jobs =
      jobsData?.pages?.flatMap((page) => page.payload?.data ?? []) ?? [];
    const job = jobs.find((j) => j.id === task?.job_application_id);
    return {
      jobTitle: job?.job_title || "General task",
      company: job?.company_name || "General task",
    };
  }, [jobsData, task?.job_application_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-border/60 bg-background p-0 shadow-2xl sm:max-w-[680px] rounded-3xl">
        <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-background via-muted/40 to-emerald-50/40 px-6 py-6">
          <div className="pr-8">
            <DialogTitle className="text-2xl font-semibold leading-tight text-foreground">
              {task?.name || "Task Details"}
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              View task information, deadlines, and progress at a glance.
            </DialogDescription>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(task?.status)}`}
              >
                {task?.status || "Unknown status"}
              </Badge>

              <Badge
                variant="outline"
                className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeStyles(task?.task_type)}`}
              >
                {task?.task_type || "Unknown type"}
              </Badge>

              {task?.is_overdue && (
                <Badge
                  variant="outline"
                  className="rounded-full border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                >
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              label="Due Date"
              value={formatDate(task?.due_date)}
            />

            <InfoCard
              icon={<AlertCircle className="h-4 w-4" />}
              label="Overdue"
              value={task?.is_overdue ? "Yes" : "No"}
              valueClassName={
                task?.is_overdue ? "text-red-600" : "text-foreground"
              }
            />

            <InfoCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Created At"
              value={formatDate(task?.created_at)}
            />

            <InfoCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Updated At"
              value={formatDate(task?.updated_at)}
            />
          </div>

          {task?.job_application_id && (
            <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Job Application
                </p>
              </div>

              <p className="text-sm font-medium text-foreground">
                {jobTitle} at {company}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Task ID
              </p>
            </div>

            <p className="break-all font-mono text-sm text-foreground">
              {task?.id || "-"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
