import { Contact, ContactType } from '@/lib/types'
import { create } from 'zustand'

interface ContactStore {
    selectedContactId: string | null
    isViewOpen: boolean
    setIsViewOpen: (open: boolean) => void
    viewContact: (contact_id: string) => void
    editingContact: Contact | null
    isLinkingSheetOpen: boolean
    setIsLinkingSheetOpen: (open: boolean) => void
    linkingContact: Contact | null
    sheetOpen: boolean
    setSheetOpen: (open: boolean) => void
    editContact: (contact: Contact) => void
    linkContact: (contact: Contact) => void
    defaultRelationshipType: ContactType
    handleAddClick: (type: ContactType) => void
}


export const useContactStore = create<ContactStore>((set) => ({
    selectedContactId: null,
    isViewOpen: false,
    setIsViewOpen: (open) => set({
        isViewOpen: open,
        selectedContactId: open ? null : null
    }),
    viewContact: (val) => set({ selectedContactId: val, isViewOpen: true }),
    // Editing and Adding Contacts
    editingContact: null,
    setIsLinkingSheetOpen: (open) => set({
        isLinkingSheetOpen: open,
        linkingContact: open ? null : null
    }),
    isLinkingSheetOpen: false,
    linkingContact: null,
    sheetOpen: false,
    setSheetOpen: (open) => set({
        sheetOpen: open,
        editingContact: open ? null : null
    }),
    editContact: (val) => set({ editingContact: val, sheetOpen: true }),
    linkContact: (val) => set({ linkingContact: val, isLinkingSheetOpen: true }),
    defaultRelationshipType: "referral",
    handleAddClick: (val) => set({ editingContact: null, sheetOpen: true, defaultRelationshipType: val }),
}))