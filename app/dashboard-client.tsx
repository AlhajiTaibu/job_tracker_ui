"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
import { KanbanColumn } from "@/components/kanban-column";
import { AddJobSheet } from "@/components/add-job-sheet";
import type {
  JobApplication,
  JobApplicationResponse,
  JobStatus,
} from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { fetchJobs, useJobs } from "@/hooks/use-jobs";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

const columns: { status: JobStatus; title: string; color: string }[] = [
  { status: "saved", title: "Saved", color: "bg-slate-400" },
  { status: "applied", title: "Applied", color: "bg-blue-500" },
  { status: "screening", title: "Screening", color: "bg-amber-500" },
  { status: "assessment", title: "Assessment", color: "bg-green-500" },
  { status: "interviewing", title: "Interview", color: "bg-green-500" },
  { status: "offer", title: "Offer", color: "bg-emerald-500" },
  { status: "accepted", title: "Accepted", color: "bg-emerald-500" },
  { status: "rejected", title: "Rejected", color: "bg-rose-500" },
  { status: "withdrawn", title: "Withdrawn", color: "bg-red-500" },
  { status: "stale", title: "Stale", color: "bg-red-500" },
];

export default function DashboardClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<JobStatus>("saved");

  const { data: jobsData } = useJobs();

  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);

  const jobs = jobsData?.payload?.data ?? [];

  const [localJobs, setLocalJobs] = useState<JobApplication[]>([]);

  useEffect(() => {
    if (jobsData?.payload?.data) setLocalJobs(jobsData?.payload?.data);
  }, [jobsData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function canMove(from: JobStatus, to: JobStatus) {
    const allowed: Record<JobStatus, JobStatus[]> = {
      saved: ["applied", "withdrawn"],
      applied: ["screening", "assessment", "stale", "rejected", "withdrawn"],
      screening: [
        "interviewing",
        "assessment",
        "stale",
        "rejected",
        "withdrawn",
      ],
      assessment: ["interviewing", "stale", "rejected", "withdrawn"],
      interviewing: ["offer", "assessment", "stale", "rejected", "withdrawn"],
      offer: ["accepted", "rejected", "withdrawn"],
      accepted: [],
      rejected: [],
      withdrawn: [],
      stale: ["withdrawn", "applied"],
    };

    return allowed[from]?.includes(to) ?? false;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const jobId = event.active.id as string;
    const job = jobs.find((j) => j.id === jobId) ?? null;
    setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(`active: ${active.id}, over: ${over?.id}`);

    if (!over) {
      setActiveJob(null);
      return;
    }

    const jobId = String(active.id);
    const newStatus = String(over.id) as JobStatus;
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (!canMove(job.status, newStatus)) {
      setActiveJob(null);
    }

    setLocalJobs((prev) =>
      prev.map((job) =>
        String(job.id) === jobId ? { ...job, status: newStatus } : job,
      ),
    );
    console.log(localJobs);
    setActiveJob(null);
  };

  const handleDragCancel = () => {
    setActiveJob(null);
  };

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) => {
      job.company_name?.toLowerCase().includes(query) ||
        job.job_title?.toLowerCase().includes(query);
    });
  }, [jobs, searchQuery]);

  const jobsByStatus: Record<JobStatus, JobApplication[]> = useMemo(() => {
    return {
      saved: filteredJobs.filter((job) => job.status === "saved"),
      applied: filteredJobs.filter((job) => job.status === "applied"),
      screening: filteredJobs.filter((job) => job.status === "screening"),
      assessment: filteredJobs.filter((job) => job.status === "assessment"),
      interviewing: filteredJobs.filter((job) => job.status === "interviewing"),
      offer: filteredJobs.filter((job) => job.status === "offer"),
      rejected: filteredJobs.filter((job) => job.status === "rejected"),
      accepted: filteredJobs.filter((job) => job.status === "accepted"),
      withdrawn: filteredJobs.filter((job) => job.status === "withdrawn"),
      stale: filteredJobs.filter((job) => job.status === "stale"),
    };
  }, [filteredJobs]);

  const handleAddClick = (status: JobStatus) => {
    setEditingJob(null);
    setDefaultStatus(status);
    setSheetOpen(true);
  };

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
    setSheetOpen(true);
  };

  const handleSaveJob = (
    jobData: Omit<JobApplication, "id"> & { id?: string },
  ) => {
    // if (jobData.id) {
    //   setJobs((prev) =>
    //     prev.map((job) =>
    //       job.id === jobData.id
    //         ? ({ ...job, ...jobData } as JobApplication)
    //         : job,
    //     ),
    //   );
    // } else {
    //   const newJob: JobApplication = {
    //     ...jobData,
    //     id: Date.now().toString(),
    //   };
    //   setJobs((prev) => [newJob, ...prev]);
    // }
  };

  const handleDeleteJob = (id: string) => {
    // setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const handleMoveJob = (id: string, newStatus: JobStatus) => {
    // setJobs((prev) =>
    //   prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job)),
    // );
  };

  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(
    (j) =>
      j.status !== "rejected" &&
      j.status !== "saved" &&
      j.status !== "stale" &&
      j.status !== "withdrawn",
  ).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar totalJobs={totalApplications} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Dashboard
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {activeApplications} active out of {totalApplications} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>

            <Button
              onClick={() => handleAddClick("saved")}
              className="flex sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
            <button
              onClick={() => router.push("/settings")}
              className="inline-flex rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-9 w-9 ">
                <AvatarFallback className="bg-primary/10 text-lg text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header>

        {/* Kanban Board */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="flex h-full min-h-[500px] flex-col gap-4 md:flex-row">
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
            >
              {columns.map((column) => (
                <KanbanColumn
                  key={column.status}
                  status={column.status}
                  title={column.title}
                  color={column.color}
                  jobs={jobsByStatus[column.status]}
                  activeJob={activeJob}
                  onAddClick={handleAddClick}
                  onEditJob={handleEditJob}
                  onDeleteJob={handleDeleteJob}
                  onMoveJob={handleMoveJob}
                  canMove={canMove}
                />
              ))}
            </DndContext>
          </div>
        </main>
      </div>

      <AddJobSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSaveJob}
        job={editingJob}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
