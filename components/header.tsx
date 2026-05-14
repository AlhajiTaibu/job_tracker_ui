"use client"

import { Briefcase, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onAddNew: () => void
}

export function Header({ onAddNew }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              JobTracker
            </h1>
            <p className="text-sm text-muted-foreground">
              Organize your job search
            </p>
          </div>
        </div>
        <Button onClick={onAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>
    </header>
  )
}
