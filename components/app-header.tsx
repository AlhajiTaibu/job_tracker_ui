"use client";

import { Plus, Search, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hamburger } from "@/components/ui/hamburger";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  InterviewFormat,
  InterviewOutcome,
  JobStatus,
  Profile,
  interviewOutcomeType,
  interviewFormatType,
  DocumentPurpose,
  documentsConfig,
  TaskType,
  taskTypeConfig,
  taskStatusType,
  TaskStatus,
} from "@/lib/types";
import { useNotificationBanner } from "@/hooks/use-notification";
import { useState, useEffect } from "react";
import { NotificationBell } from "./notification-bell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusConfig } from "@/lib/types";
import { RefObject } from "react";
import { UseFormSetValue } from "react-hook-form";
import { UploadDocumentInput } from "@/lib/schemas/documents";

type Notification = {
  id: number;
  title: string;
  body: string;
  read?: boolean;
};

type HeaderProps<T> = {
  headerTitle: string;
  headerDescription: string;
  searchQuery?: string;
  profile?: Profile;
  statusFilter?: JobStatus | "all";
  outcomeFilter?: InterviewOutcome | "all";
  formatFilter?: InterviewFormat | "all";
  purposeFilter?: DocumentPurpose | "all";
  typeFilter?: TaskType | "all";
  taskStatusFilter?: TaskStatus | "all";
  defaultAddValue?: T;
  addNewText?: string;
  quickUploadInputRef?: RefObject<HTMLInputElement | null>;
  uploadInputRef?: RefObject<HTMLInputElement | null>;
  setSearchQuery?: (value: string) => void;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStatusFilter?: React.Dispatch<React.SetStateAction<JobStatus | "all">>;
  setOutcomeFilter?: React.Dispatch<
    React.SetStateAction<InterviewOutcome | "all">
  >;
  setFormatFilter?: React.Dispatch<
    React.SetStateAction<InterviewFormat | "all">
  >;
  setPurposeFilter?: React.Dispatch<
    React.SetStateAction<DocumentPurpose | "all">
  >;
  setTypeFilter?: React.Dispatch<React.SetStateAction<TaskType | "all">>;
  setTaskStatusFilter?: React.Dispatch<
    React.SetStateAction<TaskStatus | "all">
  >;
  onAddNew?: (value: T) => void;
  setValue?: UseFormSetValue<UploadDocumentInput>;
};

export function AppHeader<T>({
  headerTitle,
  headerDescription,
  searchQuery,
  profile,
  statusFilter,
  outcomeFilter,
  formatFilter,
  purposeFilter,
  typeFilter,
  taskStatusFilter,
  defaultAddValue,
  addNewText,
  quickUploadInputRef,
  uploadInputRef,
  setSearchQuery,
  setMobileOpen,
  setStatusFilter,
  setOutcomeFilter,
  setFormatFilter,
  setPurposeFilter,
  setTypeFilter,
  setTaskStatusFilter,
  onAddNew,
  setValue,
}: HeaderProps<T>) {
  const { message, dismiss } = useNotificationBanner();
  const router = useRouter();
  const initials =
    `${profile?.first_name} ${profile?.last_name}`
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JD";

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!message) return;

    setNotifications((current) => {
      const exists = current.some((item) => item.id === message.id);
      if (exists) return current;

      return [{ ...message, read: false }, ...current];
    });
  }, [message]);

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            {headerTitle}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {headerDescription}
          </p>
        </div>
        {defaultAddValue && onAddNew && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              size="sm"
              onClick={() => onAddNew(defaultAddValue)}
              className="sm:hidden"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="sm:hidden">
              <NotificationBell
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          </div>
        )}

        {quickUploadInputRef && setValue && (
          <div className="sm:hidden">
            <input
              ref={quickUploadInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("file", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
            <Button onClick={() => quickUploadInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {setSearchQuery && (
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:w-64"
            />
          </div>
        )}
        {statusFilter && setStatusFilter && (
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}
          >
            <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.keys(statusConfig) as JobStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {statusConfig[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {outcomeFilter && setOutcomeFilter && (
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
              <SelectItem value="all">All Outcomes</SelectItem>
              {(Object.keys(interviewOutcomeType) as InterviewOutcome[]).map(
                (outcome) => (
                  <SelectItem key={outcome} value={outcome}>
                    {interviewOutcomeType[outcome].label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        )}

        {formatFilter && setFormatFilter && (
          <Select
            value={formatFilter}
            onValueChange={(v) => setFormatFilter(v as InterviewFormat | "all")}
          >
            <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {(Object.keys(interviewFormatType) as InterviewFormat[]).map(
                (format) => (
                  <SelectItem key={format} value={format}>
                    {interviewFormatType[format].label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        )}

        {purposeFilter && setPurposeFilter && (
          <Select
            value={purposeFilter}
            onValueChange={(v) =>
              setPurposeFilter(v as DocumentPurpose | "all")
            }
          >
            <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {(Object.keys(documentsConfig) as DocumentPurpose[]).map(
                (purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {documentsConfig[purpose].label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        )}

        {typeFilter && setTypeFilter && (
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
        )}

        {taskStatusFilter && setTaskStatusFilter && (
          <Select
            value={taskStatusFilter}
            onValueChange={(v) => setTaskStatusFilter(v as TaskStatus | "all")}
          >
            <SelectTrigger className="w-[120px] sm:w-[220px] h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.keys(taskStatusType) as TaskStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {taskStatusType[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {defaultAddValue && addNewText && onAddNew && (
          <Button
            onClick={() => onAddNew(defaultAddValue)}
            className="hidden sm:flex"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addNewText}
          </Button>
        )}

        {uploadInputRef && setValue && (
          <div className="hidden sm:block">
            <input
              ref={uploadInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("file", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
            />
            <Button onClick={() => uploadInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        )}

        {outcomeFilter && (
          <div className="hidden sm:flex">
            <NotificationBell
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        )}

        {!outcomeFilter && (
          <NotificationBell
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}

        {profile && (
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
        )}
      </div>
    </header>
  );
}
