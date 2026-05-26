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
  Mail,
  User,
} from "lucide-react";
import type { Contact, JobApplication } from "@/lib/types";

type ViewContactSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
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

function JobsSection({
  job_applications,
}: {
  job_applications?: Array<JobApplication> | null;
}) {
  const hasContacts = !!job_applications?.length;

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">
          <Briefcase className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">Jobs</h3>
      </div>

      {hasContacts ? (
        <div className="space-y-3">
          {job_applications?.map((job_application, index) => (
            <div
              key={
                job_application.id || `${job_application.job_title}-${index}`
              }
              className="rounded-xl border bg-muted p-4"
            >
              <div className="mb-3">
                <p className="text-sm font-semibold text-foreground">
                  {job_application.job_title?.trim() || "Unnamed job"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {job_application.company_name?.trim() ||
                    "No company provided"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {job_application.source?.trim() ? (
                    <span className="break-all text-blue-600 hover:underline">
                      {job_application.source}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No source</span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Tag className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {job_application.status?.trim() ? (
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusClasses(job_application.status)}`}
                    >
                      {job_application.status}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No status</span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {job_application.job_url?.trim() ? (
                    <a
                      href={job_application.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-primary hover:underline"
                    >
                      {job_application.job_url}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No job URL</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
          No jobs added
        </div>
      )}
    </section>
  );
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
            className="truncate text-primary hover:text-primary hover:underline"
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
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
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
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="rounded-xl bg-muted px-4 py-4 text-sm leading-7 text-foreground">
        {hasValue ? (
          <p className="whitespace-pre-wrap break-words">{value}</p>
        ) : (
          <p className="text-muted-foreground">Not provided</p>
        )}
      </div>
    </section>
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ViewContactSheet({
  open,
  onOpenChange,
  contact,
}: ViewContactSheetProps) {
  const formattedDate =
    formatDate(contact?.created_at) ?? formatDate(contact?.updated_at);

  if (!contact) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[85vw] sm:w-full overflow-y-auto bg-background p-0 sm:max-w-[600px]">
        <div className="flex min-h-full flex-col">
          <SheetHeader className="border-b bg-background px-6 py-6 text-left">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <User className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-2xl font-semibold text-foreground">
                  {contact.name?.trim() || "Untitled Contact"}
                </SheetTitle>

                <SheetDescription className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">
                    {contact.company?.trim() || "Unknown company"}
                  </span>
                </SheetDescription>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize `}
                  >
                    {contact.role || "Unknown"}
                  </Badge>

                  <div className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate || "No date"}</span>
                  </div>

                  {contact.relationship_type?.trim() ? (
                    <div className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{contact.relationship_type}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-5 px-6 py-6">
            <Section title="Overview" icon={<FileText className="h-4 w-4" />}>
              <InfoRow
                label="Name"
                value={contact.name}
                icon={<User className="h-4 w-4" />}
              />
              <InfoRow
                label="Email"
                value={contact.email}
                href={contact.email ? `mailto:${contact.email}` : null}
                icon={<Mail className="h-4 w-4" />}
              />
              <InfoRow
                label="LinkedIn URL"
                value={contact.linkedIn_url}
                href={contact.linkedIn_url}
                icon={<Link2 className="h-4 w-4" />}
              />
              <InfoRow
                label="Company"
                value={contact.company}
                icon={<Building2 className="h-4 w-4" />}
              />
              <InfoRow
                label="Role"
                value={contact.role}
                icon={<Briefcase className="h-4 w-4" />}
              />
              <InfoRow
                label="Relationship Type"
                value={contact.relationship_type}
                icon={<Tag className="h-4 w-4" />}
              />
              <InfoRow
                label="Created At"
                value={formattedDate}
                icon={<Calendar className="h-4 w-4" />}
              />
            </Section>
            <JobsSection job_applications={contact.job_applications} />
            <RichSection
              title="Notes"
              icon={<NotebookPen className="h-4 w-4" />}
              value={
                contact.notes?.length
                  ? contact.notes?.map((note) => `- ${note.notes}`).join("\n")
                  : null
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
