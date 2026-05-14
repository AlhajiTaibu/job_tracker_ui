"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { JobApplication, JobStatus } from "@/lib/types"
import { statusConfig } from "@/lib/types"

interface JobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (job: Omit<JobApplication, "id"> & { id?: string }) => void
  job?: JobApplication | null
}

export function JobDialog({ open, onOpenChange, onSave, job }: JobDialogProps) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    salary: "",
    status: "applied" as JobStatus,
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
    url: "",
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
        notes: job.notes || "",
        url: job.url || "",
      })
    } else {
      setFormData({
        company: "",
        position: "",
        location: "",
        salary: "",
        status: "applied",
        appliedDate: new Date().toISOString().split("T")[0],
        notes: "",
        url: "",
      })
    }
  }, [job, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      id: job?.id,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {job ? "Edit Application" : "Add New Application"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="company">Company</FieldLabel>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. Google"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="position">Position</FieldLabel>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. San Francisco, CA"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="salary">Salary (optional)</FieldLabel>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="e.g. $150k - $200k"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="date">Date Applied</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appliedDate: e.target.value })
                  }
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                value={formData.status}
                onValueChange={(value: JobStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="url">Job URL (optional)</FieldLabel>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes about this application..."
                rows={3}
              />
            </Field>
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{job ? "Save Changes" : "Add Application"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
