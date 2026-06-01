import { InterviewFormat, Interview } from '@/lib/types'
import { create } from 'zustand'

interface InterviewStore {
    selectedInterview: Interview | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewInterview: (interview: Interview) => void
    editingInterview: Interview | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editInterview: (interview: Interview) => void
    defaultFormat: InterviewFormat
    handleAddClick: (type: InterviewFormat) => void
}


export const useInterviewStore = create<InterviewStore>((set) => ({
    selectedInterview: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedInterview: open ? null : null
    }),
    viewInterview: (val) => set({ selectedInterview: val, isViewOpen: true }),
    // Editing and Adding Interview
    editingInterview: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingInterview: open ? null : null
    }),
    editInterview: (val) => set({ editingInterview: val, sheetOpen: true }),
    defaultFormat: "phone",
    handleAddClick: (val) => set({ editingInterview: null, sheetOpen: true, defaultFormat: val }),
}))