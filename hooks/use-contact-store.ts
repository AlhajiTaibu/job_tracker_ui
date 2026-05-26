import { Contact, ContactType } from '@/lib/types'
import { create } from 'zustand'

interface ContactStore {
    selectedContact: Contact | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewContact: (contact: Contact) => void
    editingContact: Contact | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editContact: (contact: Contact) => void
    defaultRelationshipType: ContactType
    handleAddClick: (type: ContactType) => void
}


export const useContactStore = create<ContactStore>((set) => ({
    selectedContact: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedContact: open ? null : null
    }),
    viewContact: (val) => set({ selectedContact: val, isViewOpen: true }),
    // Editing and Adding Contacts
    editingContact: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingContact: open ? null : null
    }),
    editContact: (val) => set({ editingContact: val, sheetOpen: true }),
    defaultRelationshipType: "referral",
    handleAddClick: (val) => set({ editingContact: null, sheetOpen: true, defaultRelationshipType: val }),
}))