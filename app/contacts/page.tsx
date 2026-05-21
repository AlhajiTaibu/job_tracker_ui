"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Linkedin,
  Building2,
  MoreHorizontal,
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

interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone?: string;
  linkedin?: string;
  type: "recruiter" | "hiring-manager" | "referral" | "other";
  notes?: string;
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Technical Recruiter",
    company: "Google",
    email: "sarah.chen@google.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/sarahchen",
    type: "recruiter",
    notes: "Very responsive, great to work with",
  },
  {
    id: "2",
    name: "Michael Torres",
    role: "Engineering Manager",
    company: "Stripe",
    email: "mtorres@stripe.com",
    type: "hiring-manager",
    notes: "Met at a tech conference",
  },
  {
    id: "3",
    name: "Emily Johnson",
    role: "Senior Engineer",
    company: "Vercel",
    email: "emily@vercel.com",
    linkedin: "linkedin.com/in/emilyjohnson",
    type: "referral",
    notes: "Former colleague, offered to refer me",
  },
  {
    id: "4",
    name: "David Park",
    role: "Talent Acquisition",
    company: "Meta",
    email: "dpark@meta.com",
    phone: "+1 (555) 987-6543",
    type: "recruiter",
  },
  {
    id: "5",
    name: "Jessica Williams",
    role: "Director of Engineering",
    company: "Netflix",
    email: "jwilliams@netflix.com",
    type: "hiring-manager",
  },
  {
    id: "6",
    name: "Alex Rivera",
    role: "Staff Engineer",
    company: "Airbnb",
    email: "arivera@airbnb.com",
    linkedin: "linkedin.com/in/alexrivera",
    type: "referral",
    notes: "Connected on LinkedIn, working on referral",
  },
];

const typeConfig = {
  recruiter: { label: "Recruiter", className: "bg-blue-100 text-blue-700" },
  "hiring-manager": {
    label: "Hiring Manager",
    className: "bg-purple-100 text-purple-700",
  },
  referral: { label: "Referral", className: "bg-emerald-100 text-emerald-700" },
  other: { label: "Other", className: "bg-slate-100 text-slate-700" },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.company.toLowerCase().includes(query) ||
      contact.role.toLowerCase().includes(query)
    );
  });

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        totalJobs={8}
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
                {filteredContacts.length} professional contacts
              </p>
            </div>
            <Button size="sm" className="sm:hidden">
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
            <Button className="hidden sm:flex">
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
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="group relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
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

                    <div className="mt-3 flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {contact.company}
                      </span>
                      <Badge
                        variant="secondary"
                        className={typeConfig[contact.type].className}
                      >
                        {typeConfig[contact.type].label}
                      </Badge>
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
                      {contact.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          asChild
                        >
                          <a
                            href={`https://${contact.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="mr-1.5 h-3.5 w-3.5" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                    </div>

                    {contact.notes && (
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {contact.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
