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
  Presentation,
  Rocket,
  ChartBar,
} from "lucide-react";
import type { Interview, JobApplication } from "@/lib/types";
import { getStatusClasses } from "@/lib/utils";
import { useJobInterviews } from "@/hooks/use-interview";
import { useHandleUnLinkContactToApplication } from "@/hooks/use-contact";

type ViewJobSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobApplication | null;
};

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
            className="truncate text-primary hover:underline"
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
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
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
              className="flex items-center justify-between rounded-xl border bg-muted px-4 py-3"
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
                  className="ml-4 shrink-0 text-sm font-medium text-primary hover:underline"
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
        <div className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
          No linked documents
        </div>
      )}
    </section>
  );
}

function ContactsSection({
  contacts,
  job_application_id,
}: {
  contacts?: Array<{
    id: string;
    name?: string | null;
    role?: string | null;
    email?: string | null;
    phone?: string | null;
    linkedin?: string | null;
  }> | null;
  job_application_id: string;
}) {
  const hasContacts = !!contacts?.length;
  const { handleUnLinkContactToApplication } =
    useHandleUnLinkContactToApplication();
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
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
              className="relative rounded-xl border bg-muted p-4"
            >
              <button
                type="button"
                onClick={() => {
                  handleUnLinkContactToApplication({
                    contact_id: contact.id,
                    application_id: job_application_id,
                  });
                }}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/20"
              >
                <X className="h-3 w-3" />
              </button>
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
        <div className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
          No contacts added
        </div>
      )}
    </section>
  );
}

function InterviewSection({ job_id }: { job_id: string }) {
  const { data: interviewsData, isLoading } = useJobInterviews({ job_id });

  const interviews = (interviewsData?.payload?.data ?? []) as Interview[];
  const hasInterviews = interviews.length > 0;

  if (isLoading) {
    return (
      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-muted-foreground">
            <Presentation className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">Interviews</h3>
        </div>

        <div className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
          Loading interviews...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground">
          <Presentation className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">Interviews</h3>
      </div>

      {hasInterviews ? (
        <div className="space-y-3">
          {interviews.map((interview, index) => {
            const title = interview.id?.trim() || `Interview ${index + 1}`;
            const format = interview.format?.trim() || "No format provided";
            const outcome = interview.outcome?.trim();
            const round = interview.round || "No round info";

            return (
              <div
                key={interview.id || index}
                className="rounded-xl border bg-muted p-4"
              >
                <div className="flex items-start gap-2 text-sm">
                  <Tag className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {format ? (
                    <span className="text-foreground"> Format: {format}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      No format provided
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <ChartBar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {outcome ? (
                    <span className="text-foreground"> Outcome: {outcome}</span>
                  ) : (
                    <span className="text-muted-foreground">No outcome</span>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {round ? (
                    <span className="text-foreground"> Round: {round}</span>
                  ) : (
                    <span className="text-muted-foreground">No round info</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-muted px-4 py-4 text-sm text-muted-foreground">
          No interviews added
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
      <SheetContent className="w-[85vw] sm:w-full overflow-y-auto bg-background p-0 sm:max-w-[600px]">
        <div className="flex min-h-full flex-col">
          <SheetHeader className="border-b bg-background px-6 py-6 text-left">
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

            <ContactsSection
              contacts={job.contacts}
              job_application_id={job.id}
            />

            <InterviewSection job_id={job.id} />

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
