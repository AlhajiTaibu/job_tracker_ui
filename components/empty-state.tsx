"use client"

import { Briefcase, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAddNew: () => void
  filtered?: boolean
}

export function EmptyState({ onAddNew, filtered }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {filtered ? "No applications found" : "No applications yet"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground text-balance">
        {filtered
          ? "Try adjusting your filters or add a new application."
          : "Start tracking your job search by adding your first application."}
      </p>
      {!filtered && (
        <Button onClick={onAddNew} className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Add Your First Application
        </Button>
      )}
    </div>
  )
}
