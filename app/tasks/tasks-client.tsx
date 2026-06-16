"use client";

import { useMemo, useState } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import TaskFormModal from "@/components/ui/task-form-modal";
import { TaskCard } from "@/components/ui/task-card";
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
import { AppHeader } from "@/components/app-header";

const statusLabelMap = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  snoozed: "Snoozed",
} as const;

export default function TasksClient() {
  const [taskStatusFilter, setTaskStatusFilter] = useState<TaskStatus | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (taskStatusFilter !== "all") f.status = taskStatusFilter;
    if (typeFilter !== "all") f.task_type = typeFilter;
    return f;
  }, [taskStatusFilter, typeFilter]);

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
  const description = `${filteredTasks.length} of ${tasks.length} tasks`;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader<TaskStatus>
          headerTitle="Tasks"
          headerDescription={description}
          defaultAddValue={defaultStatus}
          typeFilter={typeFilter}
          taskStatusFilter={taskStatusFilter}
          setTaskStatusFilter={setTaskStatusFilter}
          setTypeFilter={setTypeFilter}
          addNewText="Add Task"
          setMobileOpen={setMobileOpen}
          onAddNew={handleAddClick}
        />

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
