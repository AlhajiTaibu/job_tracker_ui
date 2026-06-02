"use client";

import { useEffect, useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus, TaskType } from "@/lib/types";
import { AddTaskInput, addTaskSchema } from "@/lib/schemas/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useTaskStore } from "@/hooks/use-task-store";
import { Bell, Check, GlassWater, Globe, Mail, Phone, Tag } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";

const taskTypes: {
  value: TaskType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "follow_up",
    label: "Follow Up",
    icon: <Phone className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "thank_you",
    label: "Thank You",
    icon: <Mail className="h-4 w-4" />,
    color: "text-green-500",
  },
  {
    value: "reminder",
    label: "Reminder",
    icon: <Bell className="h-4 w-4" />,
    color: "text-yellow-500",
  },
  {
    value: "review",
    label: "Review",
    icon: <GlassWater className="h-4 w-4" />,
    color: "text-voilet-500",
  },
  {
    value: "confirm",
    label: "Confirm",
    icon: <Check className="h-4 w-4" />,
    color: "text-voilet-500",
  },
  {
    value: "other",
    label: "Other",
    icon: <Tag className="h-4 w-4" />,
    color: "text-slate-500",
  },
];

function formatDate(value?: string) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

type ViewTaskModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
};

export default function ViewTaskModal({
  open,
  onOpenChange,
  task,
}: ViewTaskModalProps) {
  //   const { data: jobsData } = useJobs({
  //     filters: {},
  //     limit: 20,
  //   });

  //   const jobs =
  //     jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  //   const currentJob = useMemo(
  //     () => jobs.find((job) => job.id === task?.job_application_id),
  //     [jobs, task],
  //   );

  //   const currentTaskType = useMemo(
  //     () => taskTypes.find((type) => type.value === watch("task_type")),
  //     [watch("task_type")],
  //   );

  //   const onSubmit = async (data: AddTaskInput) => {
  //     console.log("Form submitted with data:", data);
  //   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl border border-border bg-background p-0 shadow-xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {task?.name || "Task Details"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View task information and current progress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <p className="mt-1 text-sm text-foreground">
                {task?.status || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Task Type
              </p>
              <p className="mt-1 text-sm text-foreground">
                {task?.task_type || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Due Date
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDate(task?.due_date)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Overdue
              </p>
              <p
                className={`mt-1 text-sm ${
                  task?.is_overdue ? "text-destructive" : "text-foreground"
                }`}
              >
                {task?.is_overdue ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDate(task?.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Updated At
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDate(task?.updated_at)}
              </p>
            </div>
          </div>

          {task?.job_application_id && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Job Application ID
              </p>
              <p className="mt-1 break-all text-sm text-foreground">
                {task.job_application_id}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Task ID
            </p>
            <p className="mt-1 break-all text-sm text-foreground">
              {task?.id || "-"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// export default function ViewTaskModal({
//   open,
//   onOpenChange,
//   task,
// }: ViewTaskModalProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[560px] rounded-2xl border border-border bg-background p-0 shadow-xl">
//         <DialogHeader className="border-b border-border px-6 py-5">
//           <DialogTitle className="text-xl font-semibold text-foreground">
//             {task?.name || "Task Details"}
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             View task information and current progress.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 px-6 py-5">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Status
//               </p>
//               <p className="mt-1 text-sm text-foreground">
//                 {task?.status || "-"}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Task Type
//               </p>
//               <p className="mt-1 text-sm text-foreground">
//                 {task?.task_type || "-"}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Due Date
//               </p>
//               <p className="mt-1 text-sm text-foreground">
//                 {formatDate(task?.due_date)}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Overdue
//               </p>
//               <p
//                 className={`mt-1 text-sm ${
//                   task?.is_overdue ? "text-destructive" : "text-foreground"
//                 }`}
//               >
//                 {task?.is_overdue ? "Yes" : "No"}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Created At
//               </p>
//               <p className="mt-1 text-sm text-foreground">
//                 {formatDate(task?.created_at)}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Updated At
//               </p>
//               <p className="mt-1 text-sm text-foreground">
//                 {formatDate(task?.updated_at)}
//               </p>
//             </div>
//           </div>

//           {task?.job_application_id && (
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Job Application ID
//               </p>
//               <p className="mt-1 break-all text-sm text-foreground">
//                 {task.job_application_id}
//               </p>
//             </div>
//           )}

//           <div>
//             <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//               Task ID
//             </p>
//             <p className="mt-1 break-all text-sm text-foreground">
//               {task?.id || "-"}
//             </p>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
