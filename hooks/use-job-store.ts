import { JobApplication, JobStatus } from '@/lib/types'
import { create } from 'zustand'

interface JobStore {
    selectedJob: JobApplication | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewJob: (job: JobApplication) => void
    editingJob: JobApplication | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editJob: (job: JobApplication) => void
    defaultStatus: JobStatus
    handleAddClick: (status: JobStatus) => void
}


export const useJobStore = create<JobStore>((set) => ({
    selectedJob: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedJob: open ? null : null
    }),
    viewJob: (val) => set({ selectedJob: val, isViewOpen: true }),
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