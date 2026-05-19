"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Globe,
  Link2,
  NotebookPen,
  Tag,
  X,
  Users,
  Paperclip,
  Mail,
  Phone,
  Linkedin,
} from "lucide-react";
import type { JobApplication } from "@/lib/types";

type ViewJobSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobApplication | null;
};

function getStatusClasses(status?: string | null) {
  const value = status?.toLowerCase();

  switch (value) {
    case "applied":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "screening":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "interview":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "offer":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    case "saved":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function formatValue(value?: string | null) {
  return value?.trim() ? value : "Not provided";
}

function InfoRow({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  href?: string | null;
}) {
  const displayValue = formatValue(value);
  const hasValue = !!value?.trim();

  return (
    <div className="grid grid-cols-1 gap-1.5 py-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>

      <div className="flex min-w-0 items-start gap-2 text-sm text-foreground">
        {icon ? (
          <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        ) : null}

        {href && hasValue ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="truncate text-blue-600 hover:text-blue-700 hover:underline"
          >
            {displayValue}
          </a>
        ) : (
          <span className={!hasValue ? "text-muted-foreground" : "break-words"}>
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="divide-y">{children}</div>
    </section>
  );
}

function RichSection({
  title,
  icon,
  value,
}: {
  title: string;
  icon: React.ReactNode;
  value?: string | null;
}) {
  const hasValue = !!value?.trim();

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm leading-7 text-foreground">
        {hasValue ? (
          <p className="whitespace-pre-wrap break-words">{value}</p>
        ) : (
          <p className="text-muted-foreground">Not provided</p>
        )}
      </div>
    </section>
  );
}

function DocumentsSection({
  documents,
}: {
  documents?: Array<{
    id?: string;
    name?: string | null;
    url?: string | null;
    type?: string | null;
  }> | null;
}) {
  const hasDocuments = !!documents?.length;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">
          <Paperclip className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          Linked Documents
        </h3>
      </div>

      {hasDocuments ? (
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={doc.id || `${doc.name}-${index}`}
              className="flex items-center justify-between rounded-xl border bg-slate-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {doc.name?.trim() || "Untitled document"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {doc.type?.trim() || "Document"}
                </p>
              </div>

              {doc.url?.trim() ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-4 shrink-0 text-sm font-medium text-blue-600 hover:underline"
                >
                  Open
                </a>
              ) : (
                <span className="ml-4 shrink-0 text-xs text-muted-foreground">
                  No link
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-muted-foreground">
          No linked documents
        </div>
      )}
    </section>
  );
}

function ContactsSection({
  contacts,
}: {
  contacts?: Array<{
    id?: string;
    name?: string | null;
    role?: string | null;
    email?: string | null;
    phone?: string | null;
    linkedin?: string | null;
  }> | null;
}) {
  const hasContacts = !!contacts?.length;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">
          <Users className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">Contacts</h3>
      </div>

      {hasContacts ? (
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={contact.id || `${contact.name}-${index}`}
              className="rounded-xl border bg-slate-50 p-4"
            >
              <div className="mb-3">
                <p className="text-sm font-semibold text-foreground">
                  {contact.name?.trim() || "Unnamed contact"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contact.role?.trim() || "No role provided"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {contact.email?.trim() ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="break-all text-blue-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No email</span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {contact.phone?.trim() ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No phone</span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Linkedin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {contact.linkedin?.trim() ? (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {contact.linkedin}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No LinkedIn</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-muted-foreground">
          No contacts added
        </div>
      )}
    </section>
  );
}

export function ViewJobSheet({ open, onOpenChange, job }: ViewJobSheetProps) {
  const formattedDate = job?.date_applied
    ? new Date(job.date_applied).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : new Date(job?.updated_at as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

  if (!job) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[85vw] sm:w-full overflow-y-auto bg-slate-50 p-0 sm:max-w-[600px]">
        <div className="flex min-h-full flex-col">
          <SheetHeader className="border-b bg-white px-6 py-6 text-left">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Briefcase className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-2xl font-semibold text-foreground">
                  {job.job_title?.trim() || "Untitled Position"}
                </SheetTitle>

                <SheetDescription className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">
                    {job.company_name?.trim() || "Unknown company"}
                  </span>
                </SheetDescription>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(job.status)}`}
                  >
                    {job.status || "Unknown"}
                  </Badge>

                  <div className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate || "No date"}</span>
                  </div>

                  {job.source?.trim() ? (
                    <div className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{job.source}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-5 px-6 py-6">
            <Section title="Overview" icon={<FileText className="h-4 w-4" />}>
              <InfoRow
                label="Company"
                value={job.company_name}
                icon={<Building2 className="h-4 w-4" />}
              />
              <InfoRow
                label="Position"
                value={job.job_title}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <InfoRow
                label="Status"
                value={job.status}
                icon={<Tag className="h-4 w-4" />}
              />
              <InfoRow
                label="Date Applied"
                value={formattedDate}
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoRow
                label="Source"
                value={job.source}
                icon={<Globe className="h-4 w-4" />}
              />
              <InfoRow
                label="Job URL"
                value={job.job_url}
                href={job.job_url}
                icon={<Link2 className="h-4 w-4" />}
              />
            </Section>

            <RichSection
              title="Job Description"
              icon={<FileText className="h-4 w-4" />}
              value={job.description}
            />
            <DocumentsSection documents={job.documents} />

            <ContactsSection contacts={job.contacts} />

            <RichSection
              title="Notes"
              icon={<NotebookPen className="h-4 w-4" />}
              value={job.notes}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
