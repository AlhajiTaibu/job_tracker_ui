"use client";
import {
  Plus,
  Search,
  StickyNote,
  Tag,
  Building2,
  Calendar,
  MoreHorizontal,
  TerminalSquare,
  Outdent,
  User,
  Timer,
  Filter,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Hamburger } from "@/components/ui/hamburger";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Interview,
  InterviewFormat,
  InterviewOutcome,
  interviewFormatType,
  interviewOutcomeType,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AddInterviewSheet } from "@/components/add-interview-sheet";
import { useInterviewStore } from "@/hooks/use-interview-store";
import { ViewInterviewSheet } from "@/components/view-interview-sheet";
import {
  useHandleDeleteInterview,
  useInterviewsHistory,
  useUpcomingInterviews,
} from "@/hooks/use-interview";
import {
  formatInterviewDate,
  truncateText,
  getInterviewOutcomeClasses,
  interviewFormatConfig,
} from "@/lib/utils";

function InterviewEmptyState({
  search,
  onAdd,
  title,
  description,
}: {
  search: string;
  onAdd: () => void;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {search ? "Try adjusting your search" : description}
      </p>
      <Button className="mt-4" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add Interview
      </Button>
    </div>
  );
}

function InterviewCard({
  interview,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  interview: Interview;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const displayDate = formatInterviewDate(interview);
  const format =
    interviewFormatConfig[
      interview.format as keyof typeof interviewFormatConfig
    ] ?? interviewFormatConfig["phone"];
  return (
    <Card key={`${interview.id}-${index}`} className="group relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {interview.company_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "JD"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-foreground">
                {interview.company_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {interview.job_title}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {interview.company_name}
            </span>
          </div>
          {interview.interviewer_name && (
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant="secondary">{interview.interviewer_name}</Badge>
            </div>
          )}
          {interview.format && (
            <div className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant="secondary" className={format.className}>
                {format.label}
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {interview.round && (
            <div className="flex items-center gap-1">
              <TerminalSquare className="mr-1.5 h-3.5 w-3.5" />
              <Badge variant="secondary">Round {interview.round}</Badge>
            </div>
          )}
          {interview.outcome && (
            <div className="flex items-center gap-1">
              <Outdent className="mr-1.5 h-3.5 w-3.5" />
              <Badge
                variant="secondary"
                className={`${getInterviewOutcomeClasses(interview.outcome)}`}
              >
                {interview.outcome}
              </Badge>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {interview.date && (
            <div className="flex items-center gap-1">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              <Badge variant="secondary">
                {formatInterviewDate(interview)}
              </Badge>
            </div>
          )}
          {interview.time && (
            <div className="flex items-center gap-1">
              <Timer className="mr-1.5 h-3.5 w-3.5" />
              <Badge variant="secondary">{interview.time}</Badge>
            </div>
          )}
        </div>
        {interview.notes && interview.notes.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <StickyNote className="h-3.5 w-3.5 shrink-0" />
            <p className="min-w-0 text-xs text-muted-foreground line-clamp-2">
              {truncateText(interview.notes, 60)}
            </p>
          </div>
        )}
        <div className="-mx-4 mt-3 flex items-center justify-between border-t border-border/50 px-4 pt-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {displayDate && (
              <>
                <Calendar className="h-3 w-3" />
                <span>{displayDate}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onView}
            className="text-xs text-primary/70 transition-colors hover:text-primary cursor-pointer"
          >
            View interview
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InterviewsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<InterviewFormat | "all">(
    "all",
  );
  const [outcomeFilter, setOutcomeFilter] = useState<InterviewOutcome | "all">(
    "all",
  );
  const { data: upcomingInterviewsData } = useUpcomingInterviews({});
  const { data: interviewsHistoryData } = useInterviewsHistory({
    search: debouncedSearch,
    filters:
      formatFilter !== "all" && outcomeFilter !== "all"
        ? { format: formatFilter, outcome: outcomeFilter }
        : formatFilter !== "all"
          ? { format: formatFilter }
          : outcomeFilter !== "all"
            ? { outcome: outcomeFilter }
            : {},
  });

  const upcomingInterviews = upcomingInterviewsData?.payload.data ?? [];
  const interviewsHistory =
    interviewsHistoryData?.pages.flatMap((page) => page.payload?.data ?? []) ??
    [];

  const [mobileOpen, setMobileOpen] = useState(false);

  const sheetOpen = useInterviewStore((state) => state.sheetOpen);
  const setSheetOpen = useInterviewStore((state) => state.setSheetOpen);
  const isViewOpen = useInterviewStore((state) => state.isViewOpen);
  const setIsViewOpen = useInterviewStore((state) => state.setIsViewOpen);
  const selectedInterview = useInterviewStore(
    (state) => state.selectedInterview,
  );
  const viewInterview = useInterviewStore((state) => state.viewInterview);
  const editingInterview = useInterviewStore((state) => state.editingInterview);
  const editInterview = useInterviewStore((state) => state.editInterview);
  const defaultFormat = useInterviewStore((state) => state.defaultFormat);
  const handleAddClick = useInterviewStore((state) => state.handleAddClick);
  const { handleDeleteInterview } = useHandleDeleteInterview();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredUpcomingInterviews = useMemo(
    () => upcomingInterviews as Interview[],
    [upcomingInterviews, searchQuery],
  );

  const filteredInterviewHistory = useMemo(
    () => interviewsHistory as Interview[],
    [interviewsHistory, searchQuery],
  );

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
                Interviews
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                Interviews
              </p>
            </div>
            <Button
              size="sm"
              className="sm:hidden"
              onClick={() => handleAddClick("phone")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select
              value={outcomeFilter}
              onValueChange={(v) =>
                setOutcomeFilter(v as InterviewOutcome | "all")
              }
            >
              <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcome</SelectItem>
                {(Object.keys(interviewOutcomeType) as InterviewOutcome[]).map(
                  (outcome) => (
                    <SelectItem key={outcome} value={outcome}>
                      {interviewOutcomeType[outcome].label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select
              value={formatFilter}
              onValueChange={(v) =>
                setFormatFilter(v as InterviewFormat | "all")
              }
            >
              <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Format</SelectItem>
                {(Object.keys(interviewFormatType) as InterviewFormat[]).map(
                  (format) => (
                    <SelectItem key={format} value={format}>
                      {interviewFormatType[format].label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Button
              className="hidden sm:flex"
              onClick={() => handleAddClick("phone")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Interview
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {filteredUpcomingInterviews.length === 0 &&
          filteredInterviewHistory.length === 0 ? (
            <InterviewEmptyState
              search={searchQuery}
              title="No interviews found"
              description="Your interviews appear here"
              onAdd={() => handleAddClick("phone")}
            />
          ) : (
            <div className="space-y-8">
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Upcoming Interviews</h2>
                  <p className="text-sm text-muted-foreground">
                    Scheduled interviews and next steps
                  </p>
                </div>
                {filteredUpcomingInterviews.length === 0 ? (
                  <InterviewEmptyState
                    search={searchQuery}
                    title="No Upcoming interviews found"
                    description="You do not have any upcoming interviews yet"
                    onAdd={() => handleAddClick("phone")}
                  />
                ) : (
                  <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUpcomingInterviews.map((interview, index) => {
                      return (
                        <InterviewCard
                          interview={interview}
                          index={index}
                          onView={() => viewInterview(interview)}
                          onEdit={() => editInterview(interview)}
                          onDelete={() => handleDeleteInterview(interview.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
              <section className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Interview History</h2>
                  <p className="text-sm text-muted-foreground">
                    All interviews
                  </p>
                </div>
                {filteredInterviewHistory.length === 0 ? (
                  <InterviewEmptyState
                    search={searchQuery}
                    title="No interviews found"
                    description="Your interviews will appear here"
                    onAdd={() => handleAddClick("phone")}
                  />
                ) : (
                  <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredInterviewHistory.map((interview, index) => {
                      return (
                        <InterviewCard
                          interview={interview}
                          index={index}
                          onView={() => viewInterview(interview)}
                          onEdit={() => editInterview(interview)}
                          onDelete={() => handleDeleteInterview(interview.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
      <AddInterviewSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        interview={editingInterview}
        defaultFormat={defaultFormat}
      />
      <ViewInterviewSheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        interview={selectedInterview}
      />
    </div>
  );
}
