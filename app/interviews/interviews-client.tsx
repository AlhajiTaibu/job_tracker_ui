"use client";
import {
  Plus,
  Search,
  StickyNote,
  Tag,
  Building2,
  Linkedin,
  Calendar,
  MoreHorizontal,
  Type,
  KeyRoundIcon,
  FlaskRound,
  Terminal,
  TerminalSquare,
  Outdent,
  User,
  Timer,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
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
import { Interview, InterviewFormat, InterviewOutcome } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

function getOutcomeClasses(outcome?: string | null) {
  const value = outcome?.toLowerCase();

  switch (value) {
    case "passed":
      return "border-green-200 bg-green-50 text-green-700";
    case "waiting":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "withdrawn":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "pending":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    case "scheduled":
      return "border-blue-200 bg-blue-100 text-blue-700";
    case "no feedback":
      return "border-slate-200 bg-orange-100 text-slate-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

const typeConfig = {
  phone: {
    label: "Phone",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  "system design": {
    label: "System Design",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  "case study": {
    label: "Case Study",
    className:
      "bg-purple-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  "pair programming": {
    label: "Pair Programming",
    className:
      "bg-purple-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  panel: {
    label: "Panel",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  technical: {
    label: "Technical",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  video: {
    label: "Video",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  behavioural: {
    label: "Behavioural",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  onsite: {
    label: "Onsite",
    className:
      "bg-green-100 text-voilet-700 dark:bg-voilet-950 dark:text-voilet-300",
  },
  other: {
    label: "Other",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
};

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

const formatDate = (interview?: Interview) => {
  const raw = interview?.created_at;
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function InterviewsClient() {
  const interviews = [
    {
      id: "1",
      company_name: "Dexwin Tech Ltd",
      job_title: "Senior Java Engineer",
      format: "phone" as InterviewFormat,
      round: 1,
      outcome: "scheduled" as InterviewOutcome,
      date: "May 30",
      time: "12:00 PM",
      notes: "Initial screening call",
      created_at: "May 30",
      interviewer_name: "Jon Doe",
    },
    {
      id: "2",
      company_name: "Adaptive Computers",
      job_title: "Software Engineer",
      format: "video" as InterviewFormat,
      round: 2,
      outcome: "passed" as InterviewOutcome,
      date: "May 19",
      time: "2:30 PM",
      notes: "Technical interview",
      created_at: "May 19",
      interviewer_name: "Adam Smith",
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
              //   onClick={() => handleAddClick("referral")}
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
            <Button
              className="hidden sm:flex"
              //   onClick={() => handleAddClick("referral")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Interview
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No interviews found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start building your professional network"}
              </p>
              <Button
                className="mt-4"
                // onClick={() => handleAddClick("referral")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Interview
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview) => {
                const displayDate = formatDate(interview);
                const format =
                  typeConfig[interview.format as keyof typeof typeConfig] ??
                  typeConfig["other"];
                return (
                  <Card key={interview.id} className="group relative">
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
                            <DropdownMenuItem
                            //   onClick={() => editContact(contact)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              //   onClick={() => handleDeleteContact(contact.id)}
                            >
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
                            <Badge variant="secondary">
                              {interview.interviewer_name}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                          <Badge
                            variant="secondary"
                            className={format.className}
                          >
                            {format.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <TerminalSquare className="mr-1.5 h-3.5 w-3.5" />
                          <Badge variant="secondary">
                            Round {interview.round}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Outdent className="mr-1.5 h-3.5 w-3.5" />
                          <Badge
                            variant="secondary"
                            className={`${getOutcomeClasses(interview.outcome)}`}
                          >
                            {interview.outcome}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          <Badge variant="secondary">{interview.date}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="mr-1.5 h-3.5 w-3.5" />
                          <Badge variant="secondary">{interview.time}</Badge>
                        </div>
                      </div>
                      {interview.notes && interview.notes.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/80">
                          <StickyNote className="h-3.5 w-3.5 shrink-0" />
                          <p className="min-w-0 text-xs text-muted-foreground line-clamp-2">
                            {truncateText(interview.notes, 60)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 px-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {displayDate && (
                            <>
                              <Calendar className="h-3 w-3" />
                              <span>{displayDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        // onClick={() => viewInterview(interview)}
                        className="text-xs text-primary/70 transition-colors hover:text-primary"
                      >
                        View interview
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          {/* <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 font-semibold text-green-700">
                    {item.company.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                      {item.jobTitle}
                    </h3>
                    <p className="text-sm text-slate-500">{item.company}</p>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {item.format}
                  </span>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                    Round {item.round}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    {item.outcome}
                  </span>
                </div>

                <p className="mb-6 line-clamp-2 text-sm text-slate-500">
                  {item.notes}
                </p>

                <div className="flex items-center justify-between border-t pt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div> */}
        </main>
      </div>
      {/* <AddContactSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              contact={editingContact}
              defaultRelationshipType={defaultRelationshipType}
            />
            <ViewContactSheet
              open={isViewOpen}
              onOpenChange={setIsViewOpen}
              contact={selectedContact}
            /> */}
    </div>
  );
}
