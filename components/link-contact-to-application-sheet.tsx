"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contact } from "@/lib/types";
import { useHandleLinkContactToApplication } from "@/hooks/use-contact";
import { useJobs } from "@/hooks/use-jobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Briefcase } from "lucide-react";

type LinkContactToApplicationFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
};

export default function LinkContactToApplicationSheet({
  open,
  onOpenChange,
  contact,
}: LinkContactToApplicationFormModalProps) {
  const { data: jobsData } = useJobs();
  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const { handleLinkContactToApplication } =
    useHandleLinkContactToApplication();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const selectedJob = jobs.find((job) => job.id === selectedJobId);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    if (contact) {
      handleLinkContactToApplication({
        contact_id: contact.id,
        application_id: selectedJobId,
      });
    }
    setSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl border border-border bg-background p-0 shadow-xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Link Contact to Application
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Link {contact?.name} to{" "}
            {selectedJob
              ? `${selectedJob.company_name} - ${selectedJob.job_title}`
              : "Application"}
          </DialogDescription>
        </DialogHeader>

        <div className="">
          <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2 p-5">
            <Field>
              <FieldLabel
                htmlFor="status"
                className="text-xs text-muted-foreground"
              >
                Job Application
              </FieldLabel>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger id="status" className="h-10">
                  <SelectValue placeholder="select a job application">
                    <div className="flex items-center gap-2">
                      <span className=" text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                      </span>
                      <span>{selectedJob ? selectedJob.company_name : ""}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center gap-2">
                        <span className=" text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        </span>
                        <span>
                          {job.company_name} - {job.job_title}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            className="bg-green-700 text-white hover:bg-green-800"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
