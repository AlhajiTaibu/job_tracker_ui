import { Task, TaskStatus } from '@/lib/types'
import { create } from 'zustand'

interface TaskStore {
    selectedTask: Task | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewTask: (task: Task) => void
    editingTask: Task | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editTask: (task: Task) => void
    defaultStatus: TaskStatus
    handleAddClick: (status: TaskStatus) => void
}


export const useTaskStore = create<TaskStore>((set) => ({
    selectedTask: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedTask: open ? null : null
    }),
    viewTask: (val) => set({ selectedTask: val, isViewOpen: true }),
    // Editing and Adding Tasks
    editingTask: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingTask: open ? null : null
    }),
    editTask: (val) => set({ editingTask: val, sheetOpen: true }),
    defaultStatus: "pending",
    handleAddClick: (val) => set({ editingTask: null, sheetOpen: true, defaultStatus: val }),
}))