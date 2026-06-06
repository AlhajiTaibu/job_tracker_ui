import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { DocumentResponse, DocumentStatus, DocumentPurpose } from "@/lib/types"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useCallback } from 'react'
import { useToast } from "./use-toast";
import { create } from "zustand"

type DocumentsParam = {
    filters?: Record<string, string | number | boolean | undefined>
    search?: string
    limit: number
    cookieStore?: ReadonlyRequestCookies
}

type DocumentInput = {
    name?: string
    file: File
    purpose: DocumentPurpose
    is_base: boolean
    is_draft: boolean
    is_submitted?: boolean
}

const fetchDocuments = async ({
    filters = {},
    search = "",
    limit = 20,
    cookieStore = {} as ReadonlyRequestCookies }: DocumentsParam): Promise<DocumentResponse> => {
    let res: Response

    if (typeof window === "undefined") {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
        res = await fetch(`${baseUrl}/api/documents/list`, {
            headers: {
                cookies: cookieStore.toString()
            }
        })
    } else {
        const params = new URLSearchParams()
        if (search) params.set("q", search)
        params.set("limit", String(limit))
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, String(value))
            }
        })
        res = await fetch(`/api/documents/list?${params.toString()}`)
    }

    if (!res.ok) {
        throw new Error("Documents fetch failed")
    }

    return res.json()
}

const uploadDocument = async (data: DocumentInput) => {
    const formData = new FormData()
    formData.append("file", data.file)
    formData.append("request_data", JSON.stringify({
        name: data.name,
        purpose: data.purpose,
        is_base: data.is_base,
        is_draft: data.is_draft
    }).toString())
    const res = await fetch("/api/documents/upload", {
        body: formData,
        method: "POST"
    })

    if (!res.ok) {
        throw new Error("Document upload failed")
    }
    return res.json()
}

const editDocument = async (docId: string, documentInput: Partial<DocumentInput>): Promise<DocumentResponse> => {

    const res = await fetch(`/api/documents/update/${docId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(documentInput),
    });

    if (!res.ok) {
        throw new Error("Edit document failed");
    }
    return res.json();
}

const deleteDocument = async (docId: string) => {
    const res = await fetch(`/api/documents/delete/${docId}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error("Document deletion failed");
    }
    return res.json();
}

const fetchDocumentStatus = async (docId: string) => {
    const res = await fetch(`/api/documents/status/${docId}`)
    if (!res.ok) {
        throw new Error("Document status check failed");
    }
    return res.json();
}

const viewDocument = async (docId: string): Promise<{ url?: string }> => {
    const res = await fetch(`/api/documents/view/${docId}`)
    if (!res.ok) {
        throw new Error("Document view failed");
    }
    return res.json();
}

const linkDocumentToApplication = async (docId: string, job_id: string) => {

    const res = await fetch(`/api/documents/link-to-application/${docId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_application_id: job_id
        })
    });

    if (!res.ok) {
        throw new Error("Document Linking to application failed");
    }
    return res.json();
}

const unLinkDocumentToApplication = async (docId: string, job_id: string) => {

    const res = await fetch(`/api/documents/unlink-to-application/${docId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            job_application_id: job_id
        })
    });

    if (!res.ok) {
        throw new Error("Document Unlinking to application failed");
    }
    return res.json();
}


const useUploadDocument = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: DocumentInput) => uploadDocument(data),
        onMutate: async (newDocument) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] })
            const previousDocuments = queryClient.getQueryData<DocumentResponse>(['documents'])
            queryClient.setQueryData<DocumentResponse>(['documents'], (old) => {
                if (!old) return old

                const optimisticDocument = {
                    ...newDocument,
                    id: crypto.randomUUID(),
                    created_at: new Date().toISOString(),
                    status: "pending" as DocumentStatus,
                    filename: "",
                    file_type: "pdf",
                    size: 100
                }

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: [...(old.payload.data ?? []), optimisticDocument],
                    },
                }
            })

            return { previousDocuments }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
        }
    })
}

const useEditDocument = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ docId, data }: { docId: string, data: Partial<DocumentInput> }) => editDocument(docId, data),
        onMutate: async ({ docId, data }) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] })
            const previousDocuments = queryClient.getQueryData<DocumentResponse>(['documents'])
            queryClient.setQueryData<DocumentResponse>(['documents'], (old) => {
                if (!old) return old

                const updatedDocument = old.payload?.data?.map((doc) => {
                    if (doc.id === docId) {
                        return {
                            ...doc,
                            ...data,
                        }
                    }
                    return doc;
                }) ?? [];

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: updatedDocument,
                    },
                }
            })

            return { previousDocuments }
        },
        onError: (err, newDocument, context) => {
            if (context?.previousDocuments) {
                queryClient.setQueryData(["documents"], context.previousDocuments);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
        }
    })
}

const useDeleteDocument = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (docId: string) => deleteDocument(docId),
        onMutate: async (docId) => {
            await queryClient.cancelQueries({ queryKey: ["documents"] });
            const previousData = queryClient.getQueryData<DocumentResponse>(["documents"]);

            queryClient.setQueryData<DocumentResponse>(['documents'], (old) => {
                if (!old) return old

                return {
                    ...old,
                    payload: {
                        ...old.payload,
                        data: old.payload.data?.filter((doc) => doc.id !== docId),
                    },
                }
            })
            return { previousData }
        },
        onError: (err, newDocument, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["documents"], context.previousData);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
        }
    })
}

const useDocumentStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (docId: string) => fetchDocumentStatus(docId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
        }
    })
}

const useLinkDocumentToApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ docId, jobId }: { docId: string, jobId: string }) => linkDocumentToApplication(docId, jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
    })
}

const useUnLinkDocumentToApplication = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ docId, jobId }: { docId: string, jobId: string }) => unLinkDocumentToApplication(docId, jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] })
            queryClient.invalidateQueries({ queryKey: ["jobs"] })
        }
    })
}

const useViewDocument = (id?: string) => {
    return useQuery({
        queryKey: ["document-view", id],
        queryFn: () => viewDocument(id!),
        enabled: !!id,
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    })
}

export const getDocumentsQueryOptions = ({
    filters = {},
    search = "",
    limit = 20,
    cookieStore = {} as ReadonlyRequestCookies }) => ({
        queryKey: ["documents", { filters, search, limit }] as const,
        queryFn: () => fetchDocuments({ filters, search, limit, cookieStore }),
        staleTime: Infinity,
        gcTime: 10 * 60 * 1000,
    })

const useDocuments = ({ filters = {}, search = "", limit = 20 }) => {
    return useQuery(getDocumentsQueryOptions({ filters, search, limit }))
}


type UploadDocument = {
    isSubmitting: boolean
    setIsSubmitting: (value: boolean) => void
}

const useUploadDocumentStore = create<UploadDocument>((set) => ({
    isSubmitting: false,
    setIsSubmitting: (value) => set({ isSubmitting: value })
}))



const useHandleUploadDocument = () => {
    const { mutateAsync } = useUploadDocument()
    const setIsSubmitting = useUploadDocumentStore((state) => state.setIsSubmitting)
    const { toast } = useToast()

    const handleUploadDocument = useCallback(
        async (data: DocumentInput) => {
            setIsSubmitting(true)
            try {
                await mutateAsync(data)
                toast({
                    title: "Document Upload",
                    description: "New Document added"
                })
            } catch {
                toast({
                    title: "Document Upload Failed",
                    description: "New Document Upload failed",
                    variant: "destructive"
                })
            }
            finally {
                setIsSubmitting(false)
            }
        },
        [mutateAsync, setIsSubmitting, toast]
    )

    return { handleUploadDocument }
}

const useHandleEditDocument = () => {
    const { mutateAsync } = useEditDocument()
    const { toast } = useToast()

    const handleEditDocument = useCallback(
        async ({ docId, updatedFields }: { docId: string; updatedFields: Partial<DocumentInput> }) => {
            try {
                await mutateAsync({ docId, data: updatedFields })
                toast({
                    title: "Document Update",
                    description: "Document updated"
                })
            } catch {
                toast({
                    title: "Document Update Failed",
                    description: "Document Update failed",
                    variant: "destructive"
                })
            }
        },
        [mutateAsync, toast]
    )

    return { handleEditDocument }
}

const useHandleDeleteDocument = () => {
    const { mutateAsync: deleteDocumentAsync } = useDeleteDocument();
    const { toast } = useToast();

    const handleDeleteDocument = useCallback(async (document_id: string) => {
        try {
            await deleteDocumentAsync(document_id);
            toast({
                title: "Success",
                description: "Document deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete document",
                variant: "destructive",
            });
        }
    }, [deleteDocumentAsync, toast]);

    return { handleDeleteDocument };
}

const useHandleDocumentStatus = () => {
    const { mutateAsync: documentStatusAsync } = useDocumentStatus();
    const { toast } = useToast();

    const handleDocumentStatus = useCallback(async (document_id: string) => {
        try {
            await documentStatusAsync(document_id);
            toast({
                title: "Success",
                description: "Document status check successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to check document status",
                variant: "destructive",
            });
        }
    }, [documentStatusAsync, toast]);

    return { handleDocumentStatus };
}

const useHandleLinkDocumentToApplication = () => {
    const { mutateAsync: linkDocumentToApplicationAsync } = useLinkDocumentToApplication();
    const { toast } = useToast();

    const handleLinkDocumentToApplication = useCallback(async (document_id: string, job_id: string) => {
        try {
            await linkDocumentToApplicationAsync({ docId: document_id, jobId: job_id });
            toast({
                title: "Success",
                description: "Document linked to application successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to link document to application status",
                variant: "destructive",
            });
        }
    }, [linkDocumentToApplicationAsync, toast]);

    return { handleLinkDocumentToApplication };
}

const useHandleUnLinkDocumentToApplication = () => {
    const { mutateAsync: UnLinkDocumentToApplicationAsync } = useUnLinkDocumentToApplication();
    const { toast } = useToast();

    const handleUnLinkDocumentToApplication = useCallback(async (document_id: string, job_id: string) => {
        try {
            await UnLinkDocumentToApplicationAsync({ docId: document_id, jobId: job_id });
            toast({
                title: "Success",
                description: "Document unlinked to application successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to unlink document to application status",
                variant: "destructive",
            });
        }
    }, [UnLinkDocumentToApplicationAsync, toast]);

    return { handleUnLinkDocumentToApplication };
}

export {
    useDocuments,
    useViewDocument,
    useHandleUploadDocument,
    useHandleEditDocument,
    useHandleDeleteDocument,
    useHandleDocumentStatus,
    useHandleLinkDocumentToApplication,
    useHandleUnLinkDocumentToApplication
}