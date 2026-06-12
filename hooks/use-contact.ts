import { useMutation, useQueryClient, useInfiniteQuery, keepPreviousData, InfiniteData } from "@tanstack/react-query";
import { ContactResponse, ContactType, NoteLog } from "@/lib/types";
import { useCallback } from "react";
import { useToast } from "./use-toast";
import { create } from "zustand";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
    cursor?: string | null
    cookieStore?: ReadonlyRequestCookies
}

// API functions
const fetchContacts = async ({
    search = "",
    limit = 20,
    cursor = null,
    cookieStore = {} as ReadonlyRequestCookies }: ContactParams): Promise<ContactResponse> => {
    let res: Response
    if (typeof window === 'undefined') {
        const baseUrl =
            typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_SITE_URL;
        res = await fetch(`${baseUrl}/api/contacts/list`, {
            headers: {
                cookie: cookieStore.toString(),
            },
            next: { revalidate: 60 },
        });
    } else {
        const baseUrl = typeof window !== 'undefined'
            ? ''
            : process.env.NEXT_PUBLIC_SITE_URL

        const params = new URLSearchParams()

        if (search) params.set("q", search)
        if (cursor) params.set("cursor", cursor)
        params.set("limit", String(limit))
        res = await fetch(`${baseUrl}/api/contacts/list?${params.toString()}`)
    }

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
        body: JSON.stringify({ job_application_id: application_id }),
    });

    if (!res.ok) {
        throw new Error("Contact linking failed");
    }
    return res.json();
}

const unlinkContactToApplication = async ({ contact_id, application_id }: { contact_id: string; application_id: string }) => {
    const res = await fetch(`/api/contacts/unlink-contact-to-application/${contact_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_application_id: application_id }),
    });

    if (!res.ok) {
        throw new Error("Contact unlinking failed");
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
export const getContactsQueryOptions = ({ search = "", limit = 20, cookieStore = {} as ReadonlyRequestCookies }: Omit<ContactParams, "cursor"> = {}) => ({
    queryKey: ["contacts", { search, limit }] as const,
    queryFn: ({ pageParam = null }: { pageParam: string | null }) => fetchContacts({ search, limit, cursor: pageParam, cookieStore }),
    getNextPageParam: (lastPage: ContactResponse) => lastPage?.payload?.next_cursor ?? undefined,
    placeholderData: keepPreviousData,
    initialPageParam: null as string | null,
    enabled: search.trim().length === 0 || search.trim().length >= 3,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
});

const useContacts = ({ search = "", limit = 20 }: Omit<ContactParams, "cursor"> = {}) => {
    return useInfiniteQuery(getContactsQueryOptions({ search, limit }))
};

const useAddContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addContact,
        onMutate: async (newContact) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueriesData({ queryKey: ["contacts"] });

            queryClient.setQueriesData({ queryKey: ['contacts'] }, (old: InfiniteData<ContactResponse | undefined>) => {
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
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: [...(page?.payload.data ?? []), optimisticContact],
                            },
                        }
                    })
                }

            })
            return { previousData }
        },
        onError: (_err, _newContact, context) => {
            context?.previousData?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
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
            const previousData = queryClient.getQueriesData({ queryKey: ["contacts"] });

            queryClient.setQueriesData({ queryKey: ['contacts'] }, (old: InfiniteData<ContactResponse | undefined>) => {
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
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: page?.payload.data?.map((contact) =>
                                    contact.id === contact_id ? { ...contact, ...newUpdatedData } : contact
                                ),
                            },
                        }
                    })
                }
            })
            return { previousData }
        },
        onError: (_err, _variables, context) => {
            context?.previousData?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    });
}

const useLinkContactToApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contact_id, application_id }: { contact_id: string, application_id: string }) => linkContactToApplication({ contact_id, application_id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        },
    });
}

const useUnLinkContactToApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contact_id, application_id }: { contact_id: string, application_id: string }) => unlinkContactToApplication({ contact_id, application_id }),
        onMutate: async ({ contact_id, application_id }) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueriesData({ queryKey: ["contacts"] });
            queryClient.setQueriesData({ queryKey: ["contacts"] }, (old: InfiniteData<any>) => {
                if (!old) return old;

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page
                        return {
                            ...page,
                            payload: {
                                ...page.payload,
                                data: page.payload.data.map((contact: any) => {
                                    if (contact.id !== contact_id) return contact;

                                    return {
                                        ...contact,
                                        job_applications: contact.job_applications?.filter(
                                            (job: any) => job.id !== application_id
                                        ) ?? [],
                                    };
                                }),
                            },
                        }
                    })
                }

                // return {
                //     ...old,
                //     payload: {
                //         ...old.payload,
                //         data: old.payload.data.map((contact: any) => {
                //             if (contact.id !== contact_id) return contact;

                //             return {
                //                 ...contact,
                //                 job_applications: contact.job_applications?.filter(
                //                     (job: any) => job.id !== application_id
                //                 ) ?? [],
                //             };
                //         }),
                //     },
                // };
            });

            return { previousData }

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        },
    });
}

const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteContact,
        onMutate: async (contact_id) => {
            await queryClient.cancelQueries({ queryKey: ["contacts"] });
            const previousData = queryClient.getQueriesData({ queryKey: ["contacts"] });

            queryClient.setQueriesData({ queryKey: ['contacts'] }, (old: InfiniteData<ContactResponse | undefined>) => {
                if (!old) return old

                return {
                    ...old,
                    pages: old.pages.map((page, index) => {
                        if (index !== 0) return page

                        return {
                            ...page,
                            payload: {
                                ...page?.payload,
                                data: page?.payload.data?.filter((contact) => contact.id !== contact_id),
                            },
                        }
                    })
                }
            })
            return { previousData }
        },
        onError: (_err, _contact_id, context) => {
            context?.previousData?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
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

const useHandleUnLinkContactToApplication = () => {
    const { mutateAsync: unlinkContactAsync } = useUnLinkContactToApplication();
    const { toast } = useToast();

    const handleUnLinkContactToApplication = useCallback(async ({ contact_id, application_id }: { contact_id: string; application_id: string }) => {
        try {
            await unlinkContactAsync({ contact_id, application_id });
            toast({
                title: "Success",
                description: "Contact unlinked to application successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to unlink contact to application",
                variant: "destructive",
            });
        }
    }, [unlinkContactAsync, toast]);

    return { handleUnLinkContactToApplication };
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
    useHandleUnLinkContactToApplication,
    useHandleDeleteContact,
    useAddContactStore,
    useEditContactStore
};