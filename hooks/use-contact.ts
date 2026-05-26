import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactResponse, ContactType, NoteLog } from "@/lib/types";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";

type ContactInput = {
    name: string;
    relationship_type: ContactType;
    company?: string;
    role?: string;
    email?: string;
    linkedIn_url?: string;
    notes?: string;
}

type ContactParams = {
    search?: string
    limit?: number
}

// API functions
const fetchContacts = async ({ search = "", limit = 20 }: ContactParams): Promise<ContactResponse> => {
    const params = new URLSearchParams()

    if (search) params.set("q", search)
    if (limit) params.set("limit", limit.toString());
    const res = await fetch(`/api/contacts/list?${params.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Contact fetch failed");
    }
    return res.json();
};

const addContact = async (newContact: ContactInput) => {
    const res = await fetch("/api/contacts/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
    });

    if (!res.ok) {
        throw new Error("Contact addition failed");
    }
    return res.json();
}

const updateContact = async ({ contact_id, updatedData }: { contact_id: string; updatedData: Partial<ContactInput> }) => {
    const res = await fetch(`/api/contacts/update/${contact_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        throw new Error("Contact update failed");
    }
    return res.json();
}

const deleteContact = async (contact_id: string) => {
    const res = await fetch(`/api/contacts/delete/${contact_id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Contact deletion failed");
    }
    return res.json();
}

const linkContactToApplication = async ({ contact_id, application_id }: { contact_id: string; application_id: string }) => {
    const res = await fetch(`/api/contacts/link-contact-to-application/${contact_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ application_id }),
    });

    if (!res.ok) {
        throw new Error("Contact linking failed");
    }
    return res.json();
}


// Zustand stores for managing submission states
type AddContactStore = {
    isSubmitting: boolean;
    setSubmitting: (value: boolean) => void;
}

const useAddContactStore = create<AddContactStore>((set) => ({
    isSubmitting: false,
    setSubmitting: (value: boolean) => set({ isSubmitting: value }),
}));

type EditContactStore = {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

const useEditContactStore = create<EditContactStore>((set) => ({
    isEditing: false,
    setIsEditing: (value: boolean) => set({ isEditing: value }),
}));


// Query and mutation hooks
const useContacts = ({ search = "", limit = 20 }: ContactParams) => {
    return useQuery({
        queryKey: ["contacts", { search, limit }],
        queryFn: () => fetchContacts({ search, limit }),
        staleTime: 60 * 1000,
    });
};

const useAddContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addContact,
        onMutate: async (newContact) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueryData<ContactResponse>(["contacts"]);

            queryClient.setQueryData<ContactResponse>(['contacts'], (old) => {
                if (!old) return old

                const optimisticContact = {
                    ...newContact,
                    id: crypto.randomUUID(),
                    notes: newContact.notes ? [{
                        id: crypto.randomUUID(),
                        notes: newContact.notes,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }] as NoteLog[] : undefined,
                    created_at: new Date().toISOString(),
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: [...(old.payload.data ?? []), optimisticContact],
                    },
                }
            })
            return { previousData }
        },
        onError: (err, newContact, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["contacts"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

const useUpdateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateContact,
        onMutate: async ({ contact_id, updatedData }) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueryData<ContactResponse>(["contacts"]);

            queryClient.setQueryData<ContactResponse>(['contacts'], (old) => {
                if (!old) return old
                const newUpdatedData = {
                    ...updatedData,
                    notes: updatedData.notes ? [{
                        id: crypto.randomUUID(),
                        notes: updatedData.notes,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }] as NoteLog[] : undefined,
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.map((contact) =>
                            contact.id === contact_id ? { ...contact, ...newUpdatedData } : contact
                        ),
                    },
                }
            })
            return { previousData }
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["contacts"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

const useLinkContactToApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkContactToApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}

const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteContact,
        onMutate: async (contact_id) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueryData<ContactResponse>(["contacts"]);

            queryClient.setQueryData<ContactResponse>(['contacts'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.filter((contact) => contact.id !== contact_id),
                    },
                }
            })
            return { previousData }
        },
        onError: (err, contact_id, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["contacts"], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
    });
}


// Handlers for component integration
const useHandleAddContact = () => {
    const { mutateAsync: addContactAsync } = useAddContact();
    const { toast } = useToast();
    const setIsSubmitting = useAddContactStore((state) => state.setSubmitting);

    const handleAddContact = useCallback(async (newContact: ContactInput) => {
        try {
            setIsSubmitting(true);
            await addContactAsync(newContact);
            toast({
                title: "Success",
                description: "Contact added successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add contact",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [addContactAsync, toast, setIsSubmitting]);

    return { handleAddContact };
}

const useHandleUpdateContact = () => {
    const { mutateAsync: updateContactAsync } = useUpdateContact();
    const { toast } = useToast();
    const setIsEditing = useEditContactStore((state) => state.setIsEditing);

    const handleUpdateContact = useCallback(async ({ contact_id, updatedData }: { contact_id: string; updatedData: Partial<ContactInput> }) => {
        try {
            setIsEditing(true);
            await updateContactAsync({ contact_id, updatedData });
            toast({
                title: "Success",
                description: "Contact updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update contact",
                variant: "destructive",
            });
        } finally {
            setIsEditing(false);
        }
    }, [updateContactAsync, toast, setIsEditing]);

    return { handleUpdateContact };
}

const useHandleLinkContactToApplication = () => {
    const { mutateAsync: linkContactAsync } = useLinkContactToApplication();
    const { toast } = useToast();

    const handleLinkContactToApplication = useCallback(async ({ contact_id, application_id }: { contact_id: string; application_id: string }) => {
        try {
            await linkContactAsync({ contact_id, application_id });
            toast({
                title: "Success",
                description: "Contact linked to application successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to link contact to application",
                variant: "destructive",
            });
        }
    }, [linkContactAsync, toast]);

    return { handleLinkContactToApplication };
}

const useHandleDeleteContact = () => {
    const { mutateAsync: deleteContactAsync } = useDeleteContact();
    const { toast } = useToast();

    const handleDeleteContact = useCallback(async (contact_id: string) => {
        try {
            await deleteContactAsync(contact_id);
            toast({
                title: "Success",
                description: "Contact deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete contact",
                variant: "destructive",
            });
        }
    }, [deleteContactAsync, toast]);

    return { handleDeleteContact };
}

export {
    useContacts,
    useHandleAddContact,
    useHandleUpdateContact,
    useHandleLinkContactToApplication,
    useHandleDeleteContact,
    useAddContactStore,
    useEditContactStore
};