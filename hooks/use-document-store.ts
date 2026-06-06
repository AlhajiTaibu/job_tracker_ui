import { Document, DocumentStatus } from '@/lib/types'
import { create } from 'zustand'

interface DocumentStore {
    selectedDocument: Document | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewDocument: (Document: Document) => void
    editingDocument: Document | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editDocument: (Document: Document) => void
    defaultStatus: DocumentStatus
    handleAddClick: (status: DocumentStatus) => void
}


export const useDocumentStore = create<DocumentStore>((set) => ({
    selectedDocument: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedDocument: open ? null : null
    }),
    viewDocument: (val) => set({ selectedDocument: val, isViewOpen: true }),
    // Editing and Adding Documents
    editingDocument: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingDocument: open ? null : null
    }),
    editDocument: (val) => set({ editingDocument: val, sheetOpen: true }),
    defaultStatus: "pending",
    handleAddClick: (val) => set({ editingDocument: null, sheetOpen: true, defaultStatus: val }),
}))