"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
import { AddJobSheet } from "@/components/add-job-sheet";
import { KanbanCard } from "@/components/kanban-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobApplication, JobStatus } from "@/lib/types";
import { statusConfig } from "@/lib/types";
import { fetchJobs, useJobs } from "@/hooks/use-jobs";

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const { data: jobsData, isPending, isFetching } = useJobs();

  const jobs = jobsData?.payload?.data ?? [];

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) => {
      job.company_name?.toLowerCase().includes(query) ||
        job.job_title?.toLowerCase().includes(query);
    });
  }, [jobs, searchQuery]);

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

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar totalJobs={jobs.length} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                All Applications
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {filteredJobs.length} of {jobs.length} applications
              </p>
            </div>
            <Button
              size="sm"
              className="sm:hidden"
              onClick={() => {
                setEditingJob(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}
            >
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusConfig[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setEditingJob(null);
                setSheetOpen(true);
              }}
              className="hidden sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No applications found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start by adding your first job application"}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setEditingJob(null);
                  setSheetOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Application
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredJobs.map((job) => (
                <KanbanCard
                  key={job.id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                  onMove={handleMoveJob}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddJobSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSaveJob}
        job={editingJob}
        defaultStatus="saved"
      />
    </div>
  );
}
