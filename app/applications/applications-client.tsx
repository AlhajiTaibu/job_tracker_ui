"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
import { AddJobSheet } from "@/components/add-job-sheet";
import { ViewJobSheet } from "@/components/view-job-sheet";
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
import { useJobs } from "@/hooks/use-jobs";
import { useJobStore } from "@/hooks/use-job-store";
import { Hamburger } from "@/components/ui/hamburger";

export default function ApplicationsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const {
    data: jobsData,
    isPending,
    isFetching,
  } = useJobs({
    search: debouncedSearch,
    filters: statusFilter !== "all" ? { status: statusFilter } : {},
    limit: 20,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isViewOpen = useJobStore((state) => state.isViewOpen);
  const selectedJob = useJobStore((state) => state.selectedJob);
  const setIsViewOpen = useJobStore((state) => state.setIsViewOpen);

  const sheetOpen = useJobStore((state) => state.sheetOpen);
  const setSheetOpen = useJobStore((state) => state.setSheetOpen);
  const editingJob = useJobStore((state) => state.editingJob);
  const defaultStatus = useJobStore((state) => state.defaultStatus);
  const handleAddClick = useJobStore((state) => state.handleAddClick);

  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const filteredJobs = jobs;

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
                All Applications
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {filteredJobs.length} of {jobs.length} applications
              </p>
            </div>
            <Button
              size="sm"
              className="sm:hidden"
              onClick={() => handleAddClick("saved")}
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
              <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
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
              onClick={() => handleAddClick("saved")}
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
              <Button className="mt-4" onClick={() => handleAddClick("saved")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Application
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredJobs.map((job) => (
                <KanbanCard key={job.id} job={job} addStatus={true} />
              ))}
            </div>
          )}
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
