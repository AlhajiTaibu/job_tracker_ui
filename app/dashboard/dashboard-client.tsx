"use client";

import { useState, useMemo, useEffect } from "react";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
import { KanbanColumn } from "@/components/kanban-column";
import { AddJobSheet } from "@/components/add-job-sheet";
import { ViewJobSheet } from "@/components/view-job-sheet";
import type { JobApplication, JobStatus } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobs } from "@/hooks/use-jobs";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useJobStore } from "@/hooks/use-job-store";
import { useHandleMove } from "@/hooks/use-jobs";
import { useProfile } from "@/hooks/use-profile";
import { Hamburger } from "@/components/ui/hamburger";
import { Profile } from "@/lib/types";
import { AppHeader } from "@/components/app-header";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isViewOpen = useJobStore((state) => state.isViewOpen);
  const selectedJobId = useJobStore((state) => state.selectedJobId);
  const setIsViewOpen = useJobStore((state) => state.setIsViewOpen);

  const sheetOpen = useJobStore((state) => state.sheetOpen);
  const setSheetOpen = useJobStore((state) => state.setSheetOpen);
  const editingJob = useJobStore((state) => state.editingJob);
  const defaultStatus = useJobStore((state) => state.defaultStatus);
  const handleAddClick = useJobStore((state) => state.handleAddClick);
  const { handleMove } = useHandleMove();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("token")) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: jobsData } = useJobs({
    search: searchQuery,
    filters: {},
    limit: 20,
  });

  const [activeJob, setActiveJob] = useState<JobApplication | null>(null);

  const jobs =
    jobsData?.pages?.flatMap((page) => page.payload?.data ?? []) ?? [];

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
  );

  const canMove = (from: JobStatus, to: JobStatus) => {
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
  };

  const handleDragStart = (event: DragStartEvent) => {
    const jobId = event.active.id as string;
    const job = jobs.find((j) => j.id === jobId) ?? null;
    setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

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
    handleMove(jobId, job.status, newStatus);
    setActiveJob(null);
  };

  const handleDragCancel = () => {
    setActiveJob(null);
  };

  const filteredJobs = jobs;

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

  const totalApplications = jobs.length;
  const activeApplications = jobs.filter(
    (j) =>
      j.status !== "rejected" &&
      j.status !== "saved" &&
      j.status !== "stale" &&
      j.status !== "withdrawn",
  ).length;
  const { data: profileData } = useProfile();
  const profile = profileData?.payload ?? ({} as Profile);
  const initials =
    `${profile?.first_name} ${profile?.last_name}`
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JD";

  const [mobileOpen, setMobileOpen] = useState(false);
  const description = `${activeApplications} active out of ${totalApplications} total`;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {/* <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Dashboard
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {activeApplications} active out of {totalApplications} total
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleAddClick("saved")}
              className="sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
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
              className="hidden sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
            <button
              onClick={() => router.push("/settings")}
              className="inline-flex rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="h-9 w-9 ">
                <AvatarImage
                  src={profile?.avatar_url || ""}
                  alt={initials || "User avatar"}
                />
                <AvatarFallback className="bg-primary/10 text-lg text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </header> */}
        <AppHeader
          headerTitle="Dashboard"
          headerDescription={description}
          searchQuery={searchQuery}
          profile={profile}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          onAddNew={handleAddClick}
        />

        {/* Kanban Board */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="flex h-full min-h-[500px] flex-col gap-4 md:flex-row">
            <DndContext
              id="kanban-dnd"
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
        job={editingJob}
        defaultStatus={defaultStatus}
      />

      <ViewJobSheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        job={selectedJob}
      />
    </div>
  );
}
