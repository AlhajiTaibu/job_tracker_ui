"use client";

import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Document } from "@/lib/types";
import { EditDocumentInput, editDocumentSchema } from "@/lib/schemas/documents";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useHandleEditDocument } from "@/hooks/use-documents";

type DocumentEditFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
};

export default function DocumentEditFormModal({
  open,
  onOpenChange,
  document,
}: DocumentEditFormModalProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditDocumentInput>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      name: "",
      is_base: false,
      is_draft: false,
      is_submitted: false,
    },
  });

  const { handleEditDocument } = useHandleEditDocument();

  useEffect(() => {
    if (document) {
      reset({
        name: document.name ?? "",
        is_base: document.is_base ?? false,
        is_draft: document.is_draft ?? false,
        is_submitted: document.is_submitted ?? false,
      });
    }
  }, [document, reset]);

  const onSubmit = (value: EditDocumentInput) => {
    if (document) {
      const data = {
        name: value.name ?? "",
        is_base: value.is_base,
        is_draft: value.is_draft,
        is_submitted: value.is_submitted,
      };

      handleEditDocument({
        docId: document.id,
        updatedFields: data,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl border border-border bg-background p-0 shadow-xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Edit Document
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update document, mark as submitted, base or draft.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Follow up with recruiter"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2">
              <Controller
                control={control}
                name="is_base"
                render={({ field }) => (
                  <Checkbox
                    id="is_base"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                )}
              />
              <label
                htmlFor="is_base"
                className="text-sm font-medium text-foreground leading-none"
              >
                Base document
              </label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2">
              <Controller
                control={control}
                name="is_draft"
                render={({ field }) => (
                  <Checkbox
                    id="is_draft"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                )}
              />
              <label
                htmlFor="is_draft"
                className="text-sm font-medium text-foreground leading-none"
              >
                Is Draft
              </label>
            </div>

            <div className="flex items-center space-x-2 rounded-lg bg-background px-3 py-2">
              <Controller
                control={control}
                name="is_submitted"
                render={({ field }) => (
                  <Checkbox
                    id="is_submitted"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                )}
              />
              <label
                htmlFor="is_submitted"
                className="text-sm font-medium text-foreground leading-none"
              >
                Submitted
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-700 text-white hover:bg-green-800"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
