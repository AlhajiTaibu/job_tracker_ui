"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { AddJobSheet } from "@/components/add-job-sheet";
import { ViewJobSheet } from "@/components/view-job-sheet";
import { KanbanCard } from "@/components/kanban-card";
import type { JobStatus } from "@/lib/types";
import { useJobs } from "@/hooks/use-jobs";
import { useJobStore } from "@/hooks/use-job-store";
import { AppHeader } from "@/components/app-header";

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
  const selectedJobId = useJobStore((state) => state.selectedJobId);
  const setIsViewOpen = useJobStore((state) => state.setIsViewOpen);

  const sheetOpen = useJobStore((state) => state.sheetOpen);
  const setSheetOpen = useJobStore((state) => state.setSheetOpen);
  const editingJob = useJobStore((state) => state.editingJob);
  const defaultStatus = useJobStore((state) => state.defaultStatus);
  const handleAddClick = useJobStore((state) => state.handleAddClick);

  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const filteredJobs = jobs;

  const [mobileOpen, setMobileOpen] = useState(false);
  const description = `${filteredJobs.length} of ${jobs.length} applications`;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          headerTitle="All Applications"
          headerDescription={description}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          setStatusFilter={setStatusFilter}
          onAddNew={handleAddClick}
        />
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
