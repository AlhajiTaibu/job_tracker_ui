"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import type { JobApplication, JobStatus, JobDocument, DocumentType } from "@/lib/types"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AddJobSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (job: Omit<JobApplication, "id"> & { id?: string }) => void
  job?: JobApplication | null
  defaultStatus?: JobStatus
}

const statuses: { value: JobStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "saved", label: "Saved", icon: <Bookmark className="h-4 w-4" />, color: "text-blue-500" },
  { value: "applied", label: "Applied", icon: <Send className="h-4 w-4" />, color: "text-indigo-500" },
  { value: "interview", label: "Interview", icon: <Users className="h-4 w-4" />, color: "text-amber-500" },
  { value: "offer", label: "Offer", icon: <Trophy className="h-4 w-4" />, color: "text-emerald-500" },
  { value: "rejected", label: "Rejected", icon: <XCircle className="h-4 w-4" />, color: "text-rose-500" },
]

const documentTypes: { value: DocumentType; label: string; icon: React.ReactNode }[] = [
  { value: "cv", label: "CV / Resume", icon: <FileText className="h-4 w-4" /> },
  { value: "cover_letter", label: "Cover Letter", icon: <FileCheck className="h-4 w-4" /> },
  { value: "portfolio", label: "Portfolio", icon: <FolderOpen className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <File className="h-4 w-4" /> },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function getDocumentTypeIcon(type: DocumentType) {
  const docType = documentTypes.find((d) => d.value === type)
  return docType?.icon || <File className="h-4 w-4" />
}

function getDocumentTypeLabel(type: DocumentType) {
  const docType = documentTypes.find((d) => d.value === type)
  return docType?.label || "Document"
}

export function AddJobSheet({
  open,
  onOpenChange,
  onSave,
  job,
  defaultStatus = "saved",
}: AddJobSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>("cv")
  const [isDragging, setIsDragging] = useState(false)
  
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    status: defaultStatus as JobStatus,
    appliedDate: new Date().toISOString().split("T")[0],
    url: "",
    notes: "",
    documents: [] as JobDocument[],
  })

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        position: job.position,
        location: job.location,
        salary: job.salary || "",
        status: job.status,
        appliedDate: job.appliedDate,
        url: job.url || "",
        notes: job.notes || "",
        documents: job.documents || [],
      })
    } else {
      setFormData({
        company: "",
        position: "",
        location: "",
        salary: "",
        status: defaultStatus,
        appliedDate: new Date().toISOString().split("T")[0],
        url: "",
        notes: "",
        documents: [],
      })
    }
  }, [job, defaultStatus, open])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newDocuments: JobDocument[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: selectedDocType,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }))

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments],
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeDocument = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: job?.id,
    })
    onOpenChange(false)
  }

  const currentStatus = statuses.find((s) => s.value === formData.status)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
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

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Company Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Company Details</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel htmlFor="company" className="text-xs text-muted-foreground">
                  Company Name
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Building2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Google, Apple, Meta..."
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="position" className="text-xs text-muted-foreground">
                  Position Title
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Briefcase className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Senior Software Engineer"
                    required
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="location" className="text-xs text-muted-foreground">
                  Location
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <MapPin className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="San Francisco, CA / Remote"
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
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="status" className="text-xs text-muted-foreground">
                    Status
                  </FieldLabel>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as JobStatus })
                    }
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
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <span className={status.color}>{status.icon}</span>
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="date" className="text-xs text-muted-foreground">
                    Date
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Calendar className="h-4 w-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="date"
                      type="date"
                      value={formData.appliedDate}
                      onChange={(e) =>
                        setFormData({ ...formData, appliedDate: e.target.value })
                      }
                      required
                    />
                  </InputGroup>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="salary" className="text-xs text-muted-foreground">
                  Salary Range
                  <span className="ml-1 text-muted-foreground/60">(optional)</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <DollarSign className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="salary"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    placeholder="150,000 - 200,000"
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="url" className="text-xs text-muted-foreground">
                  Job Posting URL
                  <span className="ml-1 text-muted-foreground/60">(optional)</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Link2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://careers.company.com/job/..."
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          </div>

          {/* Documents Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span>Documents</span>
              <span className="ml-1 text-xs text-muted-foreground/60">(optional)</span>
            </div>

            <div className="pl-6 space-y-4">
              {/* Document Type Selector */}
              <div className="flex flex-wrap gap-2">
                {documentTypes.map((docType) => (
                  <button
                    key={docType.value}
                    type="button"
                    onClick={() => setSelectedDocType(docType.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                      selectedDocType === docType.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {docType.icon}
                    {docType.label}
                  </button>
                ))}
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
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
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  isDragging ? "bg-primary/20" : "bg-secondary"
                )}>
                  <Upload className={cn(
                    "h-6 w-6 transition-colors",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
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
              </div>

              {/* Uploaded Documents List */}
              {formData.documents.length > 0 && (
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
              )}
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
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
  )
}
