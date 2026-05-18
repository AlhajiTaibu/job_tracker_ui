"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import type {
  JobApplication,
  JobStatus,
  JobDocument,
  DocumentType,
  JobSource,
} from "@/lib/types";
import {
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Link2,
  FileText,
  Bookmark,
  Send,
  Users,
  Trophy,
  XCircle,
  Sparkles,
  Upload,
  File,
  FileCheck,
  FolderOpen,
  X,
  Paperclip,
  LinkedinIcon,
  Glasses,
  TestTube2,
  StopCircle,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddJobInput, addJobSchema } from "@/lib/schemas/job";

interface AddJobSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (job: Omit<JobApplication, "id"> & { id?: string }) => void;
  job?: JobApplication | null;
  defaultStatus?: JobStatus;
}

const statuses: {
  value: JobStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "saved",
    label: "Saved",
    icon: <Bookmark className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "applied",
    label: "Applied",
    icon: <Send className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "screening",
    label: "Screening",
    icon: <Glasses className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "assessment",
    label: "Assessment",
    icon: <TestTube2 className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "interviewing",
    label: "Interview",
    icon: <Users className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "offer",
    label: "Offer",
    icon: <Trophy className="h-4 w-4" />,
    color: "text-emerald-500",
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: <CheckIcon className="h-4 w-4" />,
    color: "text-emerald-500",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-rose-500",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-rose-500",
  },
  {
    value: "stale",
    label: "Stale",
    icon: <StopCircle className="h-4 w-4" />,
    color: "text-rose-500",
  },
];

const sources: {
  value: JobSource;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "LinkedIn",
    label: "LinkedIn",
    icon: <LinkedinIcon className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "Referral",
    label: "Referral",
    icon: <Send className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "Company Career Page",
    label: "Company Career Page",
    icon: <Users className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "Job Board",
    label: "Job Board",
    icon: <Trophy className="h-4 w-4" />,
    color: "text-emerald-500",
  },
  {
    value: "Other",
    label: "Other",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-rose-500",
  },
];

const allowedStatus: Record<JobStatus, JobStatus[]> = {
  saved: ["applied", "withdrawn"],
  applied: ["screening", "assessment", "stale", "rejected", "withdrawn"],
  screening: ["interviewing", "assessment", "stale", "rejected", "withdrawn"],
  assessment: ["interviewing", "stale", "rejected", "withdrawn"],
  interviewing: ["offer", "assessment", "stale", "rejected", "withdrawn"],
  offer: ["accepted", "rejected", "withdrawn"],
  accepted: [],
  rejected: [],
  withdrawn: [],
  stale: ["withdrawn", "applied"],
};

// const documentTypes: {
//   value: DocumentType;
//   label: string;
//   icon: React.ReactNode;
// }[] = [
//   { value: "cv", label: "CV / Resume", icon: <FileText className="h-4 w-4" /> },
//   {
//     value: "cover_letter",
//     label: "Cover Letter",
//     icon: <FileCheck className="h-4 w-4" />,
//   },
//   {
//     value: "portfolio",
//     label: "Portfolio",
//     icon: <FolderOpen className="h-4 w-4" />,
//   },
//   { value: "other", label: "Other", icon: <File className="h-4 w-4" /> },
// ];

// function formatFileSize(bytes: number): string {
//   if (bytes < 1024) return bytes + " B";
//   if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / (1024 * 1024)).toFixed(1) + " MB";
// }

// function getDocumentTypeIcon(type: DocumentType) {
//   const docType = documentTypes.find((d) => d.value === type);
//   return docType?.icon || <File className="h-4 w-4" />;
// }

// function getDocumentTypeLabel(type: DocumentType) {
//   const docType = documentTypes.find((d) => d.value === type);
//   return docType?.label || "Document";
// }

export function AddJobSheet({
  open,
  onOpenChange,
  onSave,
  job,
  defaultStatus = "saved",
}: AddJobSheetProps) {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const [selectedDocType, setSelectedDocType] = useState<DocumentType>("cv");
  // const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddJobInput>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      company_name: "",
      job_title: "",
      status: defaultStatus,
      source: "Referral",
      date_applied: new Date().toISOString().split("T")[0],
      job_url: "",
      description: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (job) {
      reset({
        company_name: job.company_name ?? "",
        job_title: job.job_title ?? "",
        status: job.status.toLowerCase() ?? defaultStatus,
        source: job.source ?? "Referral",
        date_applied: job.date_applied ?? "",
        job_url: job.job_url ?? "",
        description: job.description ?? "",
        notes: job.notes ?? "",
      });
    } else {
      reset({
        company_name: "",
        job_title: "",
        status: defaultStatus,
        source: "Referral",
        date_applied: new Date().toISOString().split("T")[0],
        job_url: "",
        description: "",
        notes: "",
      });
    }
  }, [job, reset, defaultStatus]);

  // const [formData, setFormData] = useState({
  //   company_name: "",
  //   job_title: "",
  //   status: defaultStatus as JobStatus,
  //   source: "Referral" as JobSource,
  //   date_applied: new Date().toISOString().split("T")[0],
  //   job_url: "",
  //   description: "",
  //   notes: "",
  // });

  // useEffect(() => {
  //   if (job) {
  //     setFormData({
  //       company_name: job.company_name,
  //       job_title: job.job_title,
  //       status: job.status,
  //       source: job.source,
  //       date_applied: job.date_applied || "",
  //       job_url: job.job_url || "",
  //       description: job.description || "",
  //       notes: job.notes || "",
  //     });
  //   } else {
  //     setFormData({
  //       company_name: "",
  //       job_title: "",
  //       status: defaultStatus,
  //       source: "Referral",
  //       date_applied: new Date().toISOString().split("T")[0],
  //       job_url: "",
  //       description: "",
  //       notes: "",
  //     });
  //   }
  // }, [job, defaultStatus, open]);

  // const handleFileSelect = (files: FileList | null) => {
  //   if (!files) return;

  //   const newDocuments: JobDocument[] = Array.from(files).map((file) => ({
  //     id: crypto.randomUUID(),
  //     name: file.name,
  //     type: selectedDocType,
  //     size: file.size,
  //     uploadedAt: new Date().toISOString(),
  //     url: URL.createObjectURL(file),
  //   }));

  //   setFormData((prev) => ({
  //     ...prev,
  //     documents: [...prev.documents, ...newDocuments],
  //   }));
  // };

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragging(true);
  // };

  // const handleDragLeave = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  // };

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   setIsDragging(false);
  //   handleFileSelect(e.dataTransfer.files);
  // };

  // const removeDocument = (id: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     documents: prev.documents.filter((doc) => doc.id !== id),
  //   }));
  // };

  const onSubmit = (value: AddJobInput) => {
    if (job) {
      console.log(`${job.id} : ${value}`);
    } else {
      console.log(value);
    }
    // onSave({
    //   ...formData,
    //   id: job?.id,
    // });
    onOpenChange(false);
  };

  const currentStatus = statuses.find((s) => s.value === watch("status"));

  const currentSource = sources.find((s) => s.value === watch("source"));

  const allowed: JobStatus[] =
    allowedStatus[watch("status") as JobStatus] ?? [];

  const formStatuses = job
    ? statuses.filter((s) => allowed.includes(s.value))
    : statuses.filter((s) => s.value === "saved" || s.value === "applied");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg p-6">
        <SheetHeader className="pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg">
                {job ? "Edit Application" : "New Application"}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {job
                  ? "Update your job application details"
                  : "Track a new opportunity"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Company Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Company Details</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="company"
                  className="text-xs text-muted-foreground"
                >
                  Company Name
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Building2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="company"
                    {...register("company_name")}
                    placeholder="Google, Apple, Meta..."
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="position"
                  className="text-xs text-muted-foreground"
                >
                  Position Title
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Briefcase className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="position"
                    {...register("job_title")}
                    placeholder="Senior Software Engineer"
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>

          {/* Application Info Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Application Info</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="status"
                    className="text-xs text-muted-foreground"
                  >
                    Status
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="status" className="h-10">
                          <SelectValue>
                            <div className="flex items-center gap-2">
                              <span className={currentStatus?.color}>
                                {currentStatus?.icon}
                              </span>
                              <span>{currentStatus?.label}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {formStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <span className={status.color}>
                                  {status.icon}
                                </span>
                                <span>{status.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="date"
                    className="text-xs text-muted-foreground"
                  >
                    Date
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar className="h-4 w-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="date"
                      type="date"
                      {...register("date_applied")}
                      required
                    />
                  </InputGroup>
                </Field>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="url"
                  className="text-xs text-muted-foreground"
                >
                  Job Posting URL
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Link2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="url"
                    type="url"
                    {...register("job_url")}
                    placeholder="https://careers.company.com/job/..."
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="status"
                  className="text-xs text-muted-foreground"
                >
                  Source
                </FieldLabel>
                <Controller
                  control={control}
                  name="source"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="status" className="h-10">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className={currentSource?.color}>
                              {currentSource?.icon}
                            </span>
                            <span>{currentSource?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            <div className="flex items-center gap-2">
                              <span className={source.color}>
                                {source.icon}
                              </span>
                              <span>{source.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Documents Section */}
          {/* <div className="mt-8 space-y-5"> */}
          {/* <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span>Documents</span>
              <span className="ml-1 text-xs text-muted-foreground/60">
                (optional)
              </span>
            </div> */}

          {/* <div className="pl-6 space-y-4"> */}
          {/* Document Type Selector */}
          {/* <div className="flex flex-wrap gap-2">
                {documentTypes.map((docType) => (
                  <button
                    key={docType.value}
                    type="button"
                    onClick={() => setSelectedDocType(docType.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      selectedDocType === docType.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {docType.icon}
                    {docType.label}
                  </button>
                ))}
              </div> */}

          {/* Upload Area */}
          {/* <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30",
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
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
                <p className="mt-3 text-sm font-medium text-foreground">
                  {isDragging ? "Drop files here" : "Upload documents"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drag & drop or click to browse
                </p>
                <p className="mt-2 text-xs text-muted-foreground/60">
                  PDF, DOC, DOCX, TXT, RTF, PNG, JPG up to 10MB
                </p>
              </div> */}

          {/* Uploaded Documents List */}
          {/* {formData.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Attached ({formData.documents.length})
                  </p>
                  <div className="space-y-2">
                    {formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {getDocumentTypeIcon(doc.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{getDocumentTypeLabel(doc.type)}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.size)}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
          {/* </div>
          </div> */}

          {/* Job Description Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Job Description</span>
            </div>

            <div className="pl-6">
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Add job description"
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          {/* Notes Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Notes</span>
            </div>

            <div className="pl-6">
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add interview notes, contact info, or anything else you want to remember..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              {job ? (
                "Save Changes"
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Add Application
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
