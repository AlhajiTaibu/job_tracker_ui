"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  File,
  FileCheck,
  FileText,
  FolderOpen,
  Link2,
  Paperclip,
  RefreshCw,
  Trash2,
  Loader2,
  Upload,
  X,
  Eye,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DocumentStatus,
  DocumentPurpose,
  JobApplication,
  JobApplicationResponse,
} from "@/lib/types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UploadDocumentInput,
  uploadDocumentSchema,
} from "@/lib/schemas/documents";
import {
  useDocuments,
  useHandleDeleteDocument,
  useHandleDocumentStatus,
  useHandleLinkDocumentToApplication,
  useHandleUnLinkDocumentToApplication,
  useHandleUploadDocument,
  useViewDocument,
} from "@/hooks/use-documents";
import { useJobs } from "@/hooks/use-jobs";
import DocumentEditFormModal from "@/components/ui/document-edit-form-modal";
import { useDocumentStore } from "@/hooks/use-document-store";
import { AppHeader } from "@/components/app-header";

const DocumentPurposes: {
  value: DocumentPurpose;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "cv", label: "CV / Resume", icon: <FileText className="h-4 w-4" /> },
  {
    value: "cover letter",
    label: "Cover Letter",
    icon: <FileCheck className="h-4 w-4" />,
  },
  {
    value: "portfolio",
    label: "Portfolio",
    icon: <FolderOpen className="h-4 w-4" />,
  },
  {
    value: "offer letter",
    label: "Offer Letter",
    icon: <FileCheck className="h-4 w-4" />,
  },
  {
    value: "references",
    label: "References",
    icon: <FileText className="h-4 w-4" />,
  },
  { value: "other", label: "Other", icon: <File className="h-4 w-4" /> },
];

function getStatusStyles(status: DocumentStatus) {
  switch (status) {
    case "ready":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "completed":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "failed":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }
}

function StatusIcon({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "ready":
      return <CheckCircle2 className="h-4 w-4" />;
    case "pending":
      return <Clock3 className="h-4 w-4" />;
    case "completed":
      return <Upload className="h-4 w-4" />;
    case "failed":
      return <AlertCircle className="h-4 w-4" />;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) {
    const value = kb.toFixed(1).replace(/\.0$/, "");
    return `${value} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1).replace(/\.0$/, "")} MB`;
}

function formatUploadedAt(value: string) {
  return new Date(value).toLocaleString();
}

function getDocumentPurposeIcon(type: DocumentPurpose) {
  return (
    DocumentPurposes.find((d) => d.value === type)?.icon || (
      <File className="h-4 w-4" />
    )
  );
}

function getDocumentPurposeLabel(type: DocumentPurpose) {
  return DocumentPurposes.find((d) => d.value === type)?.label || "Document";
}

export function DocumentManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<DocumentPurpose | "all">(
    "all",
  );

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (purposeFilter !== "all") f.purpose = purposeFilter;
    return f;
  }, [purposeFilter]);

  const { data: documentsData } = useDocuments({
    search: debouncedSearch,
    filters: filters,
  });

  const { data: jobsData } = useJobs();

  const documents = documentsData?.payload?.data ?? [];
  const jobs =
    jobsData?.pages?.flatMap(
      (page: JobApplicationResponse) => page.payload?.data ?? [],
    ) ?? ([] as JobApplication[]);

  const [selectedApp, setSelectedApp] = useState<string | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { handleUploadDocument } = useHandleUploadDocument();
  const { handleDeleteDocument } = useHandleDeleteDocument();
  const { handleDocumentStatus } = useHandleDocumentStatus();
  const { handleLinkDocumentToApplication } =
    useHandleLinkDocumentToApplication();
  const { handleUnLinkDocumentToApplication } =
    useHandleUnLinkDocumentToApplication();

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const quickUploadInputRef = useRef<HTMLInputElement>(null);

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const { data: viewDocData } = useViewDocument(selectedId);

  const editingDocument = useDocumentStore((state) => state.editingDocument);
  const sheetOpen = useDocumentStore((state) => state.sheetOpen);
  const setSheetOpen = useDocumentStore((state) => state.setSheetOpen);
  const editDocument = useDocumentStore((state) => state.editDocument);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UploadDocumentInput>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      purpose: "cv",
      name: "",
      is_base: false,
      is_draft: false,
    },
  });

  const selectedFile = watch("file");

  function handleViewDocument(id: string) {
    setSelectedId(id);
  }

  useEffect(() => {
    if (viewDocData?.url) {
      window.open(viewDocData.url, "_blank");
    }
  }, [viewDocData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredDocuments = documents;

  const stats = useMemo(() => {
    return {
      total: documents.length,
      ready: documents.filter((d) => d.status === "ready").length,
      processing: documents.filter((d) => d.status === "pending").length,
      linked: documents.filter(
        (d) => d.job_applications && d.job_applications?.length > 0,
      ).length,
    };
  }, [documents]);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true, shouldDirty: true });
    }
  }

  const onSubmit = (value: UploadDocumentInput) => {
    if (!value.file) return;
    const data = {
      name: value.name ?? "",
      purpose: value.purpose as DocumentPurpose,
      file: value.file,
      is_draft: value.is_draft,
      is_base: value.is_base,
    };
    handleUploadDocument(data);
    reset();
  };

  const description =
    "Upload, review, track, and link documents to multiple applications.";

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          headerTitle="Documents"
          headerDescription={description}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setMobileOpen={setMobileOpen}
          purposeFilter={purposeFilter}
          setPurposeFilter={setPurposeFilter}
          uploadInputRef={uploadInputRef}
          quickUploadInputRef={quickUploadInputRef}
          setValue={setValue}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Documents"
                value={stats.total}
                icon={<FileText className="h-5 w-5" />}
              />
              <StatCard
                label="Ready"
                value={stats.ready}
                icon={<CheckCircle2 className="h-5 w-5" />}
              />
              <StatCard
                label="Processing"
                value={stats.processing}
                icon={<Clock3 className="h-5 w-5" />}
              />
              <StatCard
                label="Linked to Applications"
                value={stats.linked}
                icon={<Link2 className="h-5 w-5" />}
              />
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span>Upload Documents</span>
              </div>

              <div className="space-y-4 pl-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 pl-6"
                >
                  <div className="flex flex-wrap gap-2">
                    {DocumentPurposes.map((docType) => (
                      <button
                        key={docType.value}
                        type="button"
                        onClick={() =>
                          setValue(
                            "purpose",
                            docType.value as DocumentPurpose,
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          )
                        }
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                          watch("purpose") === docType.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        {docType.icon}
                        {docType.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Optional document name"
                      {...register("name")}
                    />

                    <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2">
                      <Controller
                        control={control}
                        name="is_base"
                        render={({ field }) => (
                          <Checkbox
                            id="is-base"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        )}
                      />
                      <label
                        htmlFor="is-base"
                        className="text-sm font-medium text-foreground leading-none"
                      >
                        Base document
                      </label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2">
                      <Controller
                        control={control}
                        name="is_draft"
                        render={({ field }) => (
                          <Checkbox
                            id="is-draft"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        )}
                      />
                      <label
                        htmlFor="is-draft"
                        className="text-sm font-medium text-foreground leading-none"
                      >
                        Save as draft
                      </label>
                    </div>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => uploadInputRef.current?.click()}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/30",
                    )}
                  >
                    <input
                      ref={uploadInputRef}
                      type="file"
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

                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                        isDragging ? "bg-primary/20" : "bg-secondary",
                      )}
                    >
                      <Upload
                        className={cn(
                          "h-6 w-6 transition-colors",
                          isDragging ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                    </div>

                    {selectedFile ? (
                      <>
                        <p className="mt-3 text-sm font-medium text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                        <p className="mt-2 text-xs text-primary/80">
                          Selected type:{" "}
                          {getDocumentPurposeLabel(watch("purpose"))}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm font-medium text-foreground">
                          {isDragging ? "Drop files here" : "Upload documents"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Drag & drop or click to browse
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground/60">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                        <p className="mt-1 text-xs text-primary/80">
                          Selected type:{" "}
                          {getDocumentPurposeLabel(watch("purpose"))}
                        </p>
                      </>
                    )}
                  </div>
                  {errors && (
                    <p className="text-red-600 text-sm">
                      {errors.file?.message ||
                        errors.is_base?.message ||
                        errors.is_draft?.message ||
                        errors.name?.message ||
                        errors.purpose?.message}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting.....
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Document
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              {filteredDocuments.map((doc) => (
                <section
                  key={doc.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="rounded-xl bg-muted p-3">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">
                            <h3 className="truncate text-xl font-semibold text-foreground">
                              {doc.name || doc.filename}
                            </h3>

                            <span
                              className={cn(
                                "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize",
                                getStatusStyles(doc.status),
                              )}
                            >
                              <StatusIcon status={doc.status} />
                              {doc.status}
                            </span>
                            {doc.is_draft && (
                              <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20`}
                              >
                                Draft
                              </Badge>
                            )}
                            {doc.is_base && (
                              <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 font-medium bg-green-500/10 text-green-400 border border-green-500/20`}
                              >
                                Base Document
                              </Badge>
                            )}
                            {doc.is_submitted && (
                              <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 font-medium bg-green-500/10 text-green-400 border border-green-500/20`}
                              >
                                Submitted
                              </Badge>
                            )}
                          </div>

                          <p className="mt-1 break-all text-xs text-muted-foreground">
                            {doc.filename || doc.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={doc.status === "completed"}
                          onClick={() => handleDocumentStatus(doc.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Status
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editDocument(doc)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Document
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs text-muted-foreground">
                          Document Type
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                          {getDocumentPurposeIcon(doc.purpose)}
                          <span>{getDocumentPurposeLabel(doc.purpose)}</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs text-muted-foreground">
                          Uploaded At
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">
                          {formatUploadedAt(doc.created_at)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs text-muted-foreground">
                          File Size
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">
                          {formatFileSize(doc.size)}
                        </p>
                      </div>

                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs text-muted-foreground">
                          Linked Job Apps
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">
                          {doc.job_applications?.length}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-xl border border-border bg-background p-5">
                        <div className="mb-4">
                          <p className="font-medium text-foreground">
                            Linked Applications
                          </p>
                          <p className="text-sm text-muted-foreground">
                            One document can be linked to several applications.
                          </p>
                        </div>

                        {doc.job_applications &&
                        doc.job_applications?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {doc.job_applications.map((app) => (
                              <div
                                key={app.id}
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
                              >
                                <Link2 className="h-3.5 w-3.5" />
                                <span>
                                  {app.company_name} - {app.job_title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUnLinkDocumentToApplication(
                                      doc.id,
                                      app.id,
                                    )
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                            No linked applications
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-border bg-background p-5">
                        <div className="mb-4">
                          <p className="font-medium text-foreground">
                            Link to Application
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Attach this document to another application.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Select
                            value={selectedApp || ""}
                            onValueChange={(value) => setSelectedApp(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select application" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobs
                                .filter(
                                  (app: JobApplication) =>
                                    !doc.job_applications?.includes(app),
                                )
                                .map((app: JobApplication) => (
                                  <SelectItem key={app.id} value={app.id}>
                                    {app.company_name} - {app.job_title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              if (selectedApp) {
                                handleLinkDocumentToApplication(
                                  doc.id,
                                  selectedApp,
                                );
                                setSelectedApp("");
                              }
                            }}
                            disabled={!selectedApp}
                          >
                            <Link2 className="mr-2 h-4 w-4" />
                            Link Application
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                    <div className="rounded-full bg-muted p-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">No documents found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing filters or upload a new document.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <DocumentEditFormModal
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        document={editingDocument}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-xl bg-muted p-3 text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}
