import { JobApplication, JobStatus } from '@/lib/types'
import { create } from 'zustand'

interface JobStore {
    selectedJobId: string | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewJob: (job_id: string) => void
    editingJob: JobApplication | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editJob: (job: JobApplication) => void
    defaultStatus: JobStatus
    handleAddClick: (status: JobStatus) => void
}


export const useJobStore = create<JobStore>((set) => ({
    selectedJobId: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedJobId: open ? null : null
    }),
    viewJob: (val) => set({ selectedJobId: val, isViewOpen: true }),
    // Editing and Adding Jobs
    editingJob: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingJob: open ? null : null
    }),
    editJob: (val) => set({ editingJob: val, sheetOpen: true }),
    defaultStatus: "saved",
    handleAddClick: (val) => set({ editingJob: null, sheetOpen: true, defaultStatus: val }),
}))