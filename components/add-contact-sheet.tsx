"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import type {
  JobApplication,
  JobStatus,
  JobDocument,
  DocumentType,
  JobSource,
  NoteLog,
} from "@/lib/types";
import {
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Link2,
  FileText,
  Bookmark,
  Send,
  Users,
  Trophy,
  XCircle,
  Sparkles,
  X,
  Paperclip,
  LinkedinIcon,
  Glasses,
  TestTube2,
  StopCircle,
  CheckIcon,
  Loader2,
  Mail,
  Contact2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddContactInput, addContactSchema } from "@/lib/schemas/contact";
import {
  useAddContactStore,
  useEditContactStore,
  useHandleAddContact,
  useHandleUpdateContact,
} from "@/hooks/use-contact";
import { Contact, ContactType } from "@/lib/types";

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: Contact | null;
  defaultRelationshipType?: ContactType;
}

const contactTypes: {
  value: ContactType;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "recruiter",
    label: "Recruiter",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "hiring manager",
    label: "Hiring Manager",
    icon: <Briefcase className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "referral",
    label: "Referral",
    icon: <Glasses className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "employee",
    label: "Employee",
    icon: <Contact2 className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "other",
    label: "Other",
    icon: <FileText className="h-4 w-4" />,
    color: "text-amber-500",
  },
];

export function AddContactSheet({
  open,
  onOpenChange,
  contact,
  defaultRelationshipType = "referral",
}: AddContactSheetProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddContactInput>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      company: "",
      name: "",
      relationship_type: "Referral",
      email: "",
      linkedIn_url: "",
      role: "",
      notes: "",
      previous_notes: [],
    },
  });

  const { handleAddContact } = useHandleAddContact();
  const submitting = useAddContactStore((state) => state.isSubmitting);

  const { handleUpdateContact } = useHandleUpdateContact();
  const editSubmitting = useEditContactStore((state) => state.isEditing);

  useEffect(() => {
    if (contact) {
      reset({
        company: contact.company ?? "",
        name: contact.name ?? "",
        relationship_type:
          contact.relationship_type.toLowerCase() ?? defaultRelationshipType,
        email: contact.email ?? "",
        linkedIn_url: contact.linkedIn_url ?? "",
        role: contact.role ?? "",
        notes: "",
        previous_notes: contact.notes
          ? contact.notes.map((note) => note.notes)
          : [],
      });
    } else {
      reset({
        company: "",
        name: "",
        relationship_type: defaultRelationshipType,
        email: "",
        linkedIn_url: "",
        role: "",
        notes: "",
      });
    }
  }, [contact, reset, defaultRelationshipType]);

  const onSubmit = (value: AddContactInput) => {
    if (contact) {
      const data = {
        role: value.role,
        name: value.name,
        company: value.company,
        email: value.email,
        linkedIn_url: value.linkedIn_url,
        notes: value.notes,
        relationship_type: value.relationship_type as ContactType,
      };
      handleUpdateContact({ contact_id: contact.id, updatedData: data });
    } else {
      const data = {
        role: value.role,
        name: value.name,
        company: value.company,
        email: value.email,
        linkedIn_url: value.linkedIn_url,
        notes: value.notes,
        relationship_type: value.relationship_type as ContactType,
      };
      handleAddContact(data);
    }
    onOpenChange(false);
  };

  const currentRelationshipType = contactTypes.find(
    (s) => s.value === watch("relationship_type"),
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg p-6">
        <SheetHeader className="pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg">
                {contact ? "Edit Contact" : "New Contact"}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {contact
                  ? "Update your contact details"
                  : "Create a new contact"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Contact Info Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Contact Info</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="role"
                  className="text-xs text-muted-foreground"
                >
                  Name
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Contact2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                  />
                </InputGroup>
              </Field>
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="role"
                  className="text-xs text-muted-foreground"
                >
                  Email
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Mail className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@mail.com"
                  />
                </InputGroup>
              </Field>
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="url"
                  className="text-xs text-muted-foreground"
                >
                  LinkedIn URL
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Link2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="url"
                    type="url"
                    {...register("linkedIn_url")}
                    placeholder="https://linkedin.com/..."
                  />
                </InputGroup>
              </Field>
              {errors.linkedIn_url && (
                <p className="text-red-600 text-sm">
                  {errors.linkedIn_url.message}
                </p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="status"
                  className="text-xs text-muted-foreground"
                >
                  Relationship Type
                </FieldLabel>
                <Controller
                  control={control}
                  name="relationship_type"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="status" className="h-10">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className={currentRelationshipType?.color}>
                              {currentRelationshipType?.icon}
                            </span>
                            <span>{currentRelationshipType?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {contactTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span className={type.color}>{type.icon}</span>
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Company Details Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Company Details</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="company"
                  className="text-xs text-muted-foreground"
                >
                  Company
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Building2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="company"
                    {...register("company")}
                    placeholder="Google, Apple, Meta..."
                    required
                  />
                </InputGroup>
              </Field>
              {errors.company && (
                <p className="text-red-600 text-sm">{errors.company.message}</p>
              )}

              <Field>
                <FieldLabel
                  htmlFor="role"
                  className="text-xs text-muted-foreground"
                >
                  Role
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Briefcase className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="role"
                    {...register("role")}
                    placeholder="Talent Acquisition"
                    required
                  />
                </InputGroup>
              </Field>
              {errors.role && (
                <p className="text-red-600 text-sm">{errors.role.message}</p>
              )}
            </FieldGroup>
          </div>
          {/* Notes Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Notes</span>
            </div>

            <div className="pl-6">
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add contact info, or anything else you want to remember..."
                rows={4}
                className="resize-none"
              />
            </div>
            {errors.notes && (
              <p className="text-red-600 text-sm">{errors.notes.message}</p>
            )}
            {contact && (
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Previous Notes</span>
                </div>

                <div className="pl-6">
                  <Textarea
                    value={watch("previous_notes")?.join("\n") ?? ""}
                    placeholder="Previous notes will appear here..."
                    rows={4}
                    className="resize-none bg-muted text-muted-foreground"
                    disabled
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {contact ? (
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={editSubmitting}
              >
                {editSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Contact...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Add Contact
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
