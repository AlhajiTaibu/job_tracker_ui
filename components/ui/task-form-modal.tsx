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
import { Bell, Check, GlassWater, Globe, Mail, Phone, Tag } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { useHandleAddTask, useHandleEditTask } from "@/hooks/use-task";

export type TaskFormValues = {
  name: string;
  status: TaskStatus;
  task_type: TaskType;
  due_date: string;
  job_application_id: string;
};

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

type TaskFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
};

export default function TaskFormModal({
  open,
  onOpenChange,
  task,
}: TaskFormModalProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTaskInput>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      name: "",
      task_type: "follow_up",
      due_date: "",
      job_application_id: "",
    },
  });

  const { data: jobsData } = useJobs({
    filters: {},
    limit: 20,
  });

  const { handleAddTask } = useHandleAddTask();
  const { handleEditTask } = useHandleEditTask();
  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const currentJob = useMemo(
    () => jobs.find((job) => job.id === task?.job_application_id),
    [jobs, task],
  );

  const currentTaskType = useMemo(
    () => taskTypes.find((type) => type.value === watch("task_type")),
    [watch("task_type")],
  );

  useEffect(() => {
    if (task) {
      reset({
        name: task.name ?? "",
        task_type: task.task_type ?? "follow_up",
        due_date: task.due_date
          ? new Date(task.due_date).toISOString().slice(0, 16)
          : "",
        job_application_id: task.job_application_id ?? "",
      });
    } else {
      reset({
        name: "",
        task_type: "follow_up",
        due_date: "",
        job_application_id: "",
      });
    }
  }, [task, reset]);

  const onSubmit = (value: AddTaskInput) => {
    if (task) {
      const data = {
        name: value.name,
        task_type: value.task_type as TaskType,
        due_date: value.due_date,
        job_application_id: value.job_application_id,
      };

      handleEditTask({
        taskId: task.id,
        updatedFields: data,
      });
    } else {
      const data = {
        task_type: value.task_type as TaskType,
        name: value.name,
        due_date: value.due_date,
        job_application_id: value.job_application_id,
      };
      handleAddTask(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl border border-border bg-background p-0 shadow-xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {task ? "Edit Task" : "Create Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {task
              ? "Update task details and keep your workflow organized."
              : "Add a new task to track follow-ups, thank-you, and reminders."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Follow up with recruiter"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task_type">Task Type</Label>
              <Controller
                control={control}
                name="task_type"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger id="task_type">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className={currentTaskType?.color}>
                            {currentTaskType?.icon}
                          </span>
                          <span>{currentTaskType?.label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span className={type.color}>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input
                id="due_date"
                type="datetime-local"
                {...register("due_date")}
              />
              {errors.due_date && (
                <p className="text-sm text-red-500">
                  {errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_application_id">Related to</Label>
              <Controller
                control={control}
                name="job_application_id"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    required
                  >
                    <SelectTrigger id="status" className="h-10">
                      <SelectValue
                        placeholder={
                          jobs.length === 0
                            ? "No job applications available"
                            : "Select a job application"
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">
                            <Globe className="h-4 w-4" />
                          </span>
                          <span>
                            {currentJob?.company_name} - {currentJob?.job_title}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    {jobs.length > 0 && (
                      <SelectContent>
                        {jobs.map((job, index) => (
                          <SelectItem key={`${job.id}-${index}`} value={job.id}>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-500">
                                <Globe className="h-4 w-4" />
                              </span>
                              <span>
                                {job.company_name} - {job.job_title}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    )}
                  </Select>
                )}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="task_type">Task Type</Label>
              <Select>
                <SelectTrigger id="task_type">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span className={type.color}>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-700 text-white hover:bg-green-800"
            >
              {isSubmitting
                ? task
                  ? "Saving..."
                  : "Creating..."
                : task
                  ? "Save Changes"
                  : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
