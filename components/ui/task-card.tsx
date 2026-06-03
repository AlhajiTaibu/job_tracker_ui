import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  CalendarDays,
  ClipboardList,
  BriefcaseBusiness,
  MoreHorizontal,
  Eye,
  Pencil,
  Clock3,
  Check,
  Trash2,
  X,
  Building2,
} from "lucide-react";
import { truncateText } from "@/lib/utils";
import { useJobs } from "@/hooks/use-jobs";
import { useMemo } from "react";

type TaskCardProps = {
  task: {
    id: string;
    name: string;
    status: string;
    statusLabel: string;
    due_date?: string;
    job_application_id?: string;
    task_type?: string;
  };
  onOpen?: () => void;
  onEdit?: () => void;
  onSnooze?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

function formatDate(value?: string) {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const taskTypeConfig = {
  follow_up: {
    label: "Follow up",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  thank_you: {
    label: "Thank you",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  reminder: {
    label: "Reminder",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  confirm: {
    label: "Confirmation",
    className:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  review: {
    label: "Review",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
  other: {
    label: "Other",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  },
};

function getStatusClasses(status: string) {
  switch (status) {
    case "completed":
      return "border-green-200 bg-green-50 text-green-700";
    case "pending":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    case "snoozed":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-muted bg-muted text-muted-foreground";
  }
}

export function TaskCard({
  task,
  onOpen,
  onEdit,
  onSnooze,
  onComplete,
  onDelete,
  onCancel,
}: TaskCardProps) {
  const { data: jobsData } = useJobs({});

  const { jobTitle, company } = useMemo(() => {
    const jobs =
      jobsData?.pages?.flatMap((page) => page.payload?.data ?? []) ?? [];
    const job = jobs.find((j) => j.id === task.job_application_id);
    return {
      jobTitle: job?.job_title || "General task",
      company: job?.company_name || "General task",
    };
  }, [jobsData, task.job_application_id]);

  return (
    <Card className="group rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-semibold text-green-700">
              {task.name?.charAt(0).toUpperCase() || "T"}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-foreground">
                {truncateText(task.name, 30)}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{company}</span>
              </div>

              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{jobTitle}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onOpen}>
                <Eye className="mr-2 h-4 w-4" />
                View task
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onSnooze}>
                <Clock3 className="mr-2 h-4 w-4" />
                Snooze
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onComplete}>
                <Check className="mr-2 h-4 w-4" />
                Complete
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 font-medium ${getStatusClasses(task.status)}`}
          >
            {task.statusLabel}
          </Badge>

          {task.task_type ? (
            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 font-medium ${
                taskTypeConfig[task.task_type as keyof typeof taskTypeConfig]
                  ?.className
              }`}
            >
              {taskTypeConfig[task.task_type as keyof typeof taskTypeConfig]
                ?.label || task.task_type}
            </Badge>
          ) : null}
        </div>

        <div className="mt-5 space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span className="truncate">{task.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatDate(task.due_date)}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <span className="text-sm text-muted-foreground">
            {formatDate(task.due_date)}
          </span>

          <button
            type="button"
            onClick={onOpen}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            View task
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
