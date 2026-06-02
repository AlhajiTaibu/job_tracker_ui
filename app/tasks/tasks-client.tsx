"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TaskFormModal, {
  type TaskFormValues,
} from "@/components/ui/task-form-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskCard } from "@/components/ui/task-card";
import { Hamburger } from "@/components/ui/hamburger";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
  relatedTo?: string;
  category?: string;
};

const emptyTaskValues: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  dueDate: "",
  relatedTo: "",
  category: "",
};

const statusLabelMap = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
} as const;

export default function TasksClient({
  initialTasks = [],
}: {
  initialTasks?: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.relatedTo?.toLowerCase().includes(query) ||
        task.category?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const openCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setSubmitting(true);

      if (editingTask) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id
              ? {
                  ...task,
                  title: values.title,
                  description: values.description,
                  status: values.status,
                  dueDate: values.dueDate,
                  relatedTo: values.relatedTo,
                  category: values.category,
                }
              : task,
          ),
        );
      } else {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: values.title,
          description: values.description,
          status: values.status,
          dueDate: values.dueDate,
          relatedTo: values.relatedTo,
          category: values.category,
        };

        setTasks((prev) => [newTask, ...prev]);
      }

      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: TaskFormValues = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description ?? "",
        status: editingTask.status,
        dueDate: editingTask.dueDate ?? "",
        relatedTo: editingTask.relatedTo ?? "",
        category: editingTask.category ?? "",
      }
    : emptyTaskValues;

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
            <Button onClick={openCreate} size="sm" className="sm:hidden">
              <Plus className=" h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={openCreate} className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-muted/20 p-6">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    statusLabel: statusLabelMap[task.status],
                  }}
                  onOpen={() => openEdit(task)}
                />
              ))}
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
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        loading={submitting}
        mode={editingTask ? "edit" : "create"}
      />
    </div>
  );
}
