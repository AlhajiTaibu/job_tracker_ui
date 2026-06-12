"use client";

import { useMemo, useState } from "react";
import { Filter, Plus } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import TaskFormModal from "@/components/ui/task-form-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "@/components/ui/task-card";
import { Hamburger } from "@/components/ui/hamburger";
import { TaskType, TaskStatus } from "@/lib/types";
import {
  useDailyTasks,
  useHandleDeleteTask,
  useHandleSnoozeTask,
  useHandleCancelTask,
  useOverdueTasks,
  useUpcomingTasks,
  useHandleCompleteTask,
} from "@/hooks/use-task";
import { useTaskStore } from "@/hooks/use-task-store";
import ViewTaskModal from "@/components/ui/view-task-modal";

const statusLabelMap = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  snoozed: "Snoozed",
} as const;

const taskStatusType: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  snoozed: {
    label: "Snoozed",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
};

const taskTypeConfig: Record<
  TaskType,
  { label: string; color: string; bgColor: string }
> = {
  follow_up: {
    label: "Follow Up",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  thank_you: {
    label: "Thank You",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  confirm: {
    label: "Confirmation",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  reminder: {
    label: "Reminder",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  review: {
    label: "Review",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  other: {
    label: "Other",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export default function TasksClient() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (statusFilter !== "all") f.status = statusFilter;
    if (typeFilter !== "all") f.task_type = typeFilter;
    return f;
  }, [statusFilter, typeFilter]);

  const { data: upcomingTasksData } = useUpcomingTasks({ filters });
  const { data: overdueTasksData } = useOverdueTasks({ filters });
  const { data: dailyTasksData } = useDailyTasks({ filters });

  const upcomingTasks = upcomingTasksData?.payload?.data || [];
  const overdueTasks = overdueTasksData?.payload?.data || [];
  const dailyTasks = dailyTasksData?.payload?.data || [];

  const tasks = useMemo(() => {
    const upcoming = upcomingTasksData?.payload?.data || [];
    const overdue = overdueTasksData?.payload?.data || [];
    const daily = dailyTasksData?.payload?.data || [];
    return [...upcoming, ...overdue, ...daily];
  }, [upcomingTasksData, overdueTasksData, dailyTasksData]);

  const selectedTask = useTaskStore((state) => state.selectedTask);
  const isViewOpen = useTaskStore((state) => state.isViewOpen);
  const setIsViewOpen = useTaskStore((state) => state.setIsViewOpen);
  const viewTask = useTaskStore((state) => state.viewTask);
  const editingTask = useTaskStore((state) => state.editingTask);
  const sheetOpen = useTaskStore((state) => state.sheetOpen);
  const setSheetOpen = useTaskStore((state) => state.setSheetOpen);
  const editTask = useTaskStore((state) => state.editTask);
  const defaultStatus = useTaskStore((state) => state.defaultStatus);
  const handleAddClick = useTaskStore((state) => state.handleAddClick);

  const { handleDeleteTask } = useHandleDeleteTask();
  const { handleCancelTask } = useHandleCancelTask();
  const { handleCompleteTask } = useHandleCompleteTask();
  const { handleSnoozeTask } = useHandleSnoozeTask();

  const filteredTasks = tasks;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Tasks
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>
            <Button
              onClick={() => handleAddClick(defaultStatus)}
              size="sm"
              className="sm:hidden"
            >
              <Plus className=" h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 sm:w-64"
              />
            </div> */}

            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter((v as TaskType) || "all")}
            >
              <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(Object.keys(taskTypeConfig) as TaskType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {taskTypeConfig[type].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as TaskStatus | "all")}
            >
              <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(Object.keys(taskStatusType) as TaskStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {taskStatusType[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => handleAddClick(defaultStatus)}
              className="hidden sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-muted/20 p-6">
          {filteredTasks.length > 0 ? (
            <div className="space-y-8">
              {upcomingTasks.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Upcoming Tasks
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {upcomingTasks.length} task
                        {upcomingTasks.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {upcomingTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={{
                          ...task,
                          statusLabel: statusLabelMap[task.status],
                        }}
                        onOpen={() => viewTask(task)}
                        onEdit={() => editTask(task)}
                        onSnooze={() => handleSnoozeTask(task.id, "2")}
                        onComplete={() => handleCompleteTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onCancel={() => handleCancelTask(task.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {dailyTasks.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Daily Tasks
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {dailyTasks.length} task
                        {dailyTasks.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {dailyTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={{
                          ...task,
                          statusLabel: statusLabelMap[task.status],
                        }}
                        onOpen={() => viewTask(task)}
                        onEdit={() => editTask(task)}
                        onSnooze={() => handleSnoozeTask(task.id, "2")}
                        onComplete={() => handleCompleteTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onCancel={() => handleCancelTask(task.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {overdueTasks.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Overdue Tasks
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {overdueTasks.length} task
                        {overdueTasks.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {overdueTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={{
                          ...task,
                          statusLabel: statusLabelMap[task.status],
                        }}
                        onOpen={() => viewTask(task)}
                        onEdit={() => editTask(task)}
                        onSnooze={() => handleSnoozeTask(task.id, "2")}
                        onComplete={() => handleCompleteTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onCancel={() => handleCancelTask(task.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-card">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  No tasks found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or create a new task
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <TaskFormModal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={editingTask}
      />
      <ViewTaskModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        task={selectedTask}
      />
    </div>
  );
}
