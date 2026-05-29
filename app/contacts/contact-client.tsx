"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Linkedin,
  Building2,
  MoreHorizontal,
  Calendar,
  StickyNote,
  Globe,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Hamburger } from "@/components/ui/hamburger";
import { Contact } from "@/lib/types";
import { AddContactSheet } from "@/components/add-contact-sheet";
import { ViewContactSheet } from "@/components/view-contact-sheet";
import { useContactStore } from "@/hooks/use-contact-store";
import { useContacts, useHandleDeleteContact } from "@/hooks/use-contact";
import { useJobs } from "@/hooks/use-jobs";

const typeConfig = {
  recruiter: {
    label: "Recruiter",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  "hiring manager": {
    label: "Hiring Manager",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  referral: {
    label: "Referral",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  employee: {
    label: "Employee",
    className:
      "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  other: {
    label: "Other",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
};

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

const formatDate = (contact?: Contact) => {
  const raw = contact?.updated_at || contact?.created_at;
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function ContactsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: initialContacts } = useContacts({
    search: debouncedSearch,
    limit: 20,
  });
  const contacts = initialContacts?.payload?.data || [];

  const sheetOpen = useContactStore((state) => state.sheetOpen);
  const setSheetOpen = useContactStore((state) => state.setSheetOpen);
  const isViewOpen = useContactStore((state) => state.isViewOpen);
  const setIsViewOpen = useContactStore((state) => state.setIsViewOpen);
  const selectedContact = useContactStore((state) => state.selectedContact);
  const viewContact = useContactStore((state) => state.viewContact);
  const editingContact = useContactStore((state) => state.editingContact);
  const editContact = useContactStore((state) => state.editContact);
  const defaultRelationshipType = useContactStore(
    (state) => state.defaultRelationshipType,
  );
  const handleAddClick = useContactStore((state) => state.handleAddClick);
  const { handleDeleteContact } = useHandleDeleteContact();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredContacts = contacts;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground sm:text-xl">
                Contacts
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {filteredContacts.length} professional contact
                {filteredContacts.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              size="sm"
              className="sm:hidden"
              onClick={() => handleAddClick("referral")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Button
              className="hidden sm:flex"
              onClick={() => handleAddClick("referral")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No contacts found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start building your professional network"}
              </p>
              <Button
                className="mt-4"
                onClick={() => handleAddClick("referral")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact) => {
                const displayDate = formatDate(contact);
                const relationship =
                  typeConfig[
                    contact.relationship_type as keyof typeof typeConfig
                  ] ?? typeConfig["other"];
                return (
                  <Card key={contact.id} className="group relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {contact.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "JD"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-foreground">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.role}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => editContact(contact)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {contact.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                          <Badge
                            variant="secondary"
                            className={relationship.className}
                          >
                            {relationship.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          asChild
                        >
                          <a href={`mailto:${contact.email}`}>
                            <Mail className="mr-1.5 h-3.5 w-3.5" />
                            Email
                          </a>
                        </Button>
                        {contact.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            asChild
                          >
                            <a href={`tel:${contact.phone}`}>
                              <Phone className="mr-1.5 h-3.5 w-3.5" />
                              Call
                            </a>
                          </Button>
                        )}
                        {contact.linkedIn_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            asChild
                          >
                            <a
                              href={`${contact.linkedIn_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Linkedin className="mr-1.5 h-3.5 w-3.5" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                      {contact.notes && contact.notes.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground/80">
                          <StickyNote className="h-3.5 w-3.5 shrink-0" />
                          <p className="min-w-0 text-xs text-muted-foreground line-clamp-2">
                            {truncateText(contact.notes[0]?.notes, 60)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 px-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {displayDate && (
                            <>
                              <Calendar className="h-3 w-3" />
                              <span>{displayDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => viewContact(contact)}
                        className="text-xs text-primary/70 transition-colors hover:text-primary"
                      >
                        View contact
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <AddContactSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        contact={editingContact}
        defaultRelationshipType={defaultRelationshipType}
      />
      <ViewContactSheet
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        contact={selectedContact}
      />
    </div>
  );
}
