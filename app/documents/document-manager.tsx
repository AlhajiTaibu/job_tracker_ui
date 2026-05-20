"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Link2,
  Unlink,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";

type DocumentStatus = "uploaded" | "processing" | "ready" | "failed";

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  linkedApplication?: string | null;
};

const mockDocuments: DocumentItem[] = [
  {
    id: "doc_001",
    name: "John_Doe_Resume.pdf",
    type: "Resume",
    size: "248 KB",
    uploadedAt: "2026-05-18 10:24 AM",
    status: "ready",
    linkedApplication: "Frontend Engineer at Acme",
  },
  {
    id: "doc_002",
    name: "Cover_Letter_Acme.pdf",
    type: "Cover Letter",
    size: "180 KB",
    uploadedAt: "2026-05-18 10:42 AM",
    status: "processing",
    linkedApplication: "Frontend Engineer at Acme",
  },
  {
    id: "doc_003",
    name: "Portfolio.pdf",
    type: "Portfolio",
    size: "1.2 MB",
    uploadedAt: "2026-05-17 03:15 PM",
    status: "uploaded",
    linkedApplication: null,
  },
  {
    id: "doc_004",
    name: "Jane_Doe_Resume.pdf",
    type: "Resume",
    size: "260 KB",
    uploadedAt: "2026-05-16 09:08 AM",
    status: "failed",
    linkedApplication: null,
  },
];

const applications = [
  "Frontend Engineer at Acme",
  "Product Designer at Northstar",
  "PM at Horizon Labs",
];

function getStatusStyles(status: DocumentStatus) {
  switch (status) {
    case "ready":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "processing":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "uploaded":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "failed":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }
}

function StatusIcon({ status }: { status: DocumentStatus }) {
  switch (status) {
    case "ready":
      return <CheckCircle2 className="h-4 w-4" />;
    case "processing":
      return <Clock3 className="h-4 w-4" />;
    case "uploaded":
      return <Upload className="h-4 w-4" />;
    case "failed":
      return <AlertCircle className="h-4 w-4" />;
  }
}

export function DocumentManager() {
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>(
    "all",
  );
  const [selectedApp, setSelectedApp] = useState<Record<string, string>>({});

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.type.toLowerCase().includes(search.toLowerCase()) ||
        (doc.linkedApplication || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      ready: documents.filter((d) => d.status === "ready").length,
      processing: documents.filter((d) => d.status === "processing").length,
      linked: documents.filter((d) => !!d.linkedApplication).length,
    };
  }, [documents]);

  function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    const newDocs: DocumentItem[] = Array.from(files).map((file, index) => ({
      id: `doc_new_${Date.now()}_${index}`,
      name: file.name,
      type: file.type.includes("pdf") ? "PDF" : "Document",
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: new Date().toLocaleString(),
      status: "uploaded",
      linkedApplication: null,
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
  }

  function handleDelete(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  function handleRefreshStatus(id: string) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status:
                doc.status === "uploaded"
                  ? "processing"
                  : doc.status === "processing"
                    ? "ready"
                    : doc.status,
            }
          : doc,
      ),
    );
  }

  function handleLink(id: string) {
    const application = selectedApp[id];
    if (!application) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, linkedApplication: application } : doc,
      ),
    );
  }

  function handleUnlink(id: string) {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, linkedApplication: null } : doc,
      ),
    );
  }

  const totalApplications = 10;
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar totalJobs={totalApplications} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border bg-background px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            Documents
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Upload, review, track, and link documents to job applications.
          </p>
        </header>
        <main className="min-h-screen bg-background p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Total Documents"
                  value={stats.total}
                  icon={<FileText className="h-5 w-5" />}
                />
                <StatCard
                  label="Ready"
                  value={stats.ready}
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <StatCard
                  label="Processing"
                  value={stats.processing}
                  icon={<Clock3 className="h-5 w-5" />}
                />
                <StatCard
                  label="Linked to Applications"
                  value={stats.linked}
                  icon={<Link2 className="h-5 w-5" />}
                />
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-1 flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents, type, or linked application..."
                        className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>

                    <div className="relative md:w-56">
                      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value as "all" | DocumentStatus,
                          )
                        }
                        className="h-11 w-full appearance-none rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                      >
                        <option value="all">All statuses</option>
                        <option value="uploaded">Uploaded</option>
                        <option value="processing">Processing</option>
                        <option value="ready">Ready</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                    <Upload className="h-4 w-4" />
                    Upload Document
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files)}
                    />
                  </label>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/40">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="px-4 py-3 font-medium">Document</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">
                          Linked Application
                        </th>
                        <th className="px-4 py-3 font-medium">Uploaded</th>
                        <th className="px-4 py-3 font-medium">Size</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="align-top">
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-muted p-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-foreground">
                            {doc.type}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyles(
                                doc.status,
                              )}`}
                            >
                              <StatusIcon status={doc.status} />
                              {doc.status}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <p className="text-sm text-foreground">
                                {doc.linkedApplication || "Not linked"}
                              </p>

                              <div className="flex flex-col gap-2 md:flex-row">
                                <select
                                  value={selectedApp[doc.id] || ""}
                                  onChange={(e) =>
                                    setSelectedApp((prev) => ({
                                      ...prev,
                                      [doc.id]: e.target.value,
                                    }))
                                  }
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                >
                                  <option value="">Select application</option>
                                  {applications.map((app) => (
                                    <option key={app} value={app}>
                                      {app}
                                    </option>
                                  ))}
                                </select>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleLink(doc.id)}
                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                                  >
                                    <Link2 className="h-4 w-4" />
                                    Link
                                  </button>

                                  <button
                                    onClick={() => handleUnlink(doc.id)}
                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                                  >
                                    <Unlink className="h-4 w-4" />
                                    Unlink
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {doc.uploadedAt}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {doc.size}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted">
                                <Eye className="h-4 w-4" />
                                View
                              </button>

                              <button
                                onClick={() => handleRefreshStatus(doc.id)}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Status
                              </button>

                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-500/20 px-3 text-sm text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredDocuments.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center">
                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                              <div className="rounded-full bg-muted p-3">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  No documents found
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Try changing filters or upload a new document.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-xl bg-muted p-3 text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}
