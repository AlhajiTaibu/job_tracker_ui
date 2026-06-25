"use client";

import { useEffect, useMemo } from "react";
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

import {
  MapPin,
  FileText,
  Sparkles,
  Loader2,
  Contact2,
  Phone,
  Video,
  Settings2,
  Presentation,
  Beaker,
  Globe,
  ChartAreaIcon,
  Group,
  Rocket,
  Clock,
  Calendar,
  TimerIcon,
  LucideTimer,
  Scale,
  CheckCheckIcon,
  Hourglass,
  MoveDown,
  HourglassIcon,
  WeightIcon,
  GrapeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AddInterviewInput, addInterviewSchema } from "@/lib/schemas/interview";
import {
  useAddInterviewStore,
  useEditInterviewStore,
  useHandleAddInterview,
  useHandleUpdateInterview,
} from "@/hooks/use-interview";
import { InterviewFormat, Interview, InterviewOutcome } from "@/lib/types";
import { useJobs } from "@/hooks/use-jobs";

interface AddInterviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview?: Interview | null;
  defaultFormat?: InterviewFormat;
}

const interviewFormat: {
  value: InterviewFormat;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "phone",
    label: "Phone",
    icon: <Phone className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "video",
    label: "Video",
    icon: <Video className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "onsite",
    label: "Onsite",
    icon: <MapPin className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "technical",
    label: "Technical",
    icon: <Settings2 className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "panel",
    label: "Panel",
    icon: <Presentation className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "behavioural",
    label: "Behavioural",
    icon: <Beaker className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "system design",
    label: "System Design",
    icon: <Globe className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "case study",
    label: "Case Study",
    icon: <ChartAreaIcon className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "pair programming",
    label: "Pair Programming",
    icon: <Group className="h-4 w-4" />,
    color: "text-amber-500",
  },
];

const interviewOutcome: {
  value: InterviewOutcome;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "scheduled",
    label: "Scheduled",
    icon: <Scale className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    value: "passed",
    label: "Passed",
    icon: <CheckCheckIcon className="h-4 w-4" />,
    color: "text-green-500",
  },
  {
    value: "pending",
    label: "Pending",
    icon: <Hourglass className="h-4 w-4" />,
    color: "text-indigo-500",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: <MoveDown className="h-4 w-4" />,
    color: "text-rose-500",
  },
  {
    value: "waiting",
    label: "Waiting",
    icon: <HourglassIcon className="h-4 w-4" />,
    color: "text-amber-500",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
    icon: <WeightIcon className="h-4 w-4" />,
    color: "text-red-500",
  },
  {
    value: "no feedback",
    label: "No Feedback",
    icon: <GrapeIcon className="h-4 w-4" />,
    color: "text-amber-500",
  },
];

export function AddInterviewSheet({
  open,
  onOpenChange,
  interview,
  defaultFormat = "phone",
}: AddInterviewSheetProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddInterviewInput>({
    resolver: zodResolver(addInterviewSchema),
    defaultValues: {
      round: 1,
      format: "Phone",
      date: "",
      time: "",
      interviewer_name: "",
      notes: "",
      timezone: "GMT",
      job_application_id: "",
    },
  });

  const { data: jobsData } = useJobs({
    filters: {},
    limit: 20,
  });

  const jobs =
    jobsData?.pages.flatMap((page) => page.payload?.data ?? []) ?? [];

  const eligibleJobs = useMemo(() => {
    return jobs?.filter(
      (job, index) =>
        job.status === "assessment" ||
        job.status === "interviewing" ||
        job.status === "screening",
    );
  }, [jobs]);

  const { handleAddInterview } = useHandleAddInterview();
  const submitting = useAddInterviewStore((state) => state.isSubmitting);

  const { handleUpdateInterview } = useHandleUpdateInterview();
  const editSubmitting = useEditInterviewStore((state) => state.isEditing);

  useEffect(() => {
    if (interview) {
      reset({
        round: interview.round ?? 1,
        date: interview.date ?? "",
        format: interview.format?.toLowerCase() ?? defaultFormat,
        time: interview.time ?? "",
        interviewer_name: interview.interviewer_name ?? "",
        job_application_id: interview.job_application_id ?? "",
        notes: interview.notes ?? "",
        timezone: interview.timezone ?? "",
        outcome: interview.outcome ?? ("scheduled" as InterviewOutcome),
      });
    } else {
      reset({
        round: 1,
        date: "",
        format: defaultFormat,
        time: "",
        interviewer_name: "",
        job_application_id: "",
        notes: "",
        timezone: "",
      });
    }
  }, [interview, reset, defaultFormat]);

  const onSubmit = (value: AddInterviewInput) => {
    if (interview) {
      const data = {
        job_application_id: value.job_application_id,
        time: value.time,
        date: value.date,
        round: value.round,
        interviewer_name: value.interviewer_name,
        notes: value.notes,
        format: value.format as InterviewFormat,
        actual_duration: value.actual_duration,
        estimated_duration: value.estimated_duration,
        timezone: value.timezone,
        outcome: value.outcome as InterviewOutcome,
      };
      handleUpdateInterview({ interview_id: interview.id, updatedData: data });
    } else {
      const data = {
        job_application_id: value.job_application_id,
        time: value.time,
        date: value.date,
        round: value.round,
        interviewer_name: value.interviewer_name,
        notes: value.notes,
        format: value.format as InterviewFormat,
        actual_duration: value.actual_duration,
        estimated_duration: value.estimated_duration,
        timezone: value.timezone,
        outcome: "scheduled" as InterviewOutcome,
      };
      handleAddInterview(data);
    }
    reset();
    onOpenChange(false);
  };

  const currentFormat = interviewFormat.find(
    (s) => s.value === watch("format"),
  );

  const currentOutcome = interviewOutcome.find(
    (s) => s.value === watch("outcome"),
  );

  const currentJob = jobs.find(
    (job, index) => job.id === watch("job_application_id"),
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
                {interview ? "Edit Interview" : "New Interview"}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {interview
                  ? "Update your interview details"
                  : "Create a new interview"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Interview Info Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Interview Info</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="status"
                  className="text-xs text-muted-foreground"
                >
                  Job Application
                </FieldLabel>
                <Controller
                  control={control}
                  name="job_application_id"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger id="status" className="h-10">
                        <SelectValue
                          placeholder={
                            eligibleJobs.length === 0
                              ? "No job applications available"
                              : "Select a job application"
                          }
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">
                              <Globe className="h-4 w-4" />
                            </span>
                            <span>
                              {currentJob?.company_name} -{" "}
                              {currentJob?.job_title}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      {eligibleJobs.length > 0 && (
                        <SelectContent>
                          {eligibleJobs.map((job, index) => (
                            <SelectItem
                              key={`${job.id}-${index}`}
                              value={job.id}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-blue-500">
                                  <Globe className="h-4 w-4" />
                                </span>
                                <span>
                                  {job.company_name} - {job.job_title}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                  )}
                />
              </Field>
              {errors.job_application_id && (
                <p className="text-red-600 text-sm">
                  {errors.job_application_id.message}
                </p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="status"
                  className="text-xs text-muted-foreground"
                >
                  Format
                </FieldLabel>
                <Controller
                  control={control}
                  name="format"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="status" className="h-10">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className={currentFormat?.color}>
                              {currentFormat?.icon}
                            </span>
                            <span>{currentFormat?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {interviewFormat.map((type) => (
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
              {errors.format && (
                <p className="text-red-600 text-sm">{errors.format.message}</p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="round"
                  className="text-xs text-muted-foreground"
                >
                  Round
                </FieldLabel>
                <Controller
                  control={control}
                  name="round"
                  render={({ field }) => (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(value) => field.onChange(Number(value))}
                      required
                    >
                      <SelectTrigger id="round" className="h-10">
                        <SelectValue placeholder="Select round">
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4">
                              <Rocket />
                            </span>
                            <span>
                              {field.value
                                ? `Round ${field.value}`
                                : "Select round"}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map((round) => (
                          <SelectItem key={round} value={String(round)}>
                            <div className="flex items-center gap-2">
                              <span className="h-4 w-4">
                                <Rocket />
                              </span>
                              <span>{`Round ${round}`}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              {errors.round && (
                <p className="text-red-600 text-sm">{errors.round.message}</p>
              )}

              {interview && (
                <>
                  <Field>
                    <FieldLabel
                      htmlFor="outcome"
                      className="text-xs text-muted-foreground"
                    >
                      Outcome
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="outcome"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="outcome" className="h-10">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <span className={currentOutcome?.color}>
                                  {currentOutcome?.icon}
                                </span>
                                <span>{currentOutcome?.label}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {interviewOutcome.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <span className={type.color}>
                                    {type.icon}
                                  </span>
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  {errors.outcome && (
                    <p className="text-red-600 text-sm">
                      {errors.outcome.message}
                    </p>
                  )}
                </>
              )}
              <Field>
                <FieldLabel
                  htmlFor="interviewer_name"
                  className="text-xs text-muted-foreground"
                >
                  Interviewer Name
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Contact2 className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="interviewer_name"
                    type="text"
                    {...register("interviewer_name")}
                    placeholder="John Doe"
                  />
                </InputGroup>
              </Field>
              {errors.interviewer_name && (
                <p className="text-red-600 text-sm">
                  {errors.interviewer_name.message}
                </p>
              )}
            </FieldGroup>
          </div>

          {/* Interview Schedule Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Interview Schedule</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="date"
                  className="text-xs text-muted-foreground"
                >
                  Date
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Calendar className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="date"
                    type="date"
                    {...register("date")}
                    // required
                  />
                </InputGroup>
              </Field>
              {errors.date && (
                <p className="text-red-600 text-sm">{errors.date.message}</p>
              )}

              <Field>
                <FieldLabel
                  htmlFor="time"
                  className="text-xs text-muted-foreground"
                >
                  Time
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <TimerIcon className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="time"
                    type="time"
                    {...register("time")}
                    // required
                  />
                </InputGroup>
              </Field>
              {errors.time && (
                <p className="text-red-600 text-sm">{errors.time.message}</p>
              )}
              <Field>
                <FieldLabel
                  htmlFor="timezone"
                  className="text-xs text-muted-foreground"
                >
                  Time zone
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Globe className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="timezone"
                    type="text"
                    {...register("timezone")}
                    placeholder="GMT, EST, CAT, etc"
                  />
                </InputGroup>
              </Field>
              {errors.date && (
                <p className="text-red-600 text-sm">{errors.date.message}</p>
              )}
            </FieldGroup>
          </div>
          {/* Interview Duration Section */}
          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Interview Duration</span>
            </div>

            <FieldGroup className="gap-4 pl-6">
              <Field>
                <FieldLabel
                  htmlFor="actual_duration"
                  className="text-xs text-muted-foreground"
                >
                  Actual Duration
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <LucideTimer className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="actual_duration"
                    type="text"
                    {...register("actual_duration")}
                  />
                </InputGroup>
              </Field>
              {errors.actual_duration && (
                <p className="text-red-600 text-sm">
                  {errors.actual_duration.message}
                </p>
              )}

              <Field>
                <FieldLabel
                  htmlFor="estimated_duration"
                  className="text-xs text-muted-foreground"
                >
                  Estimated Duration
                  <span className="ml-1 text-muted-foreground/60">
                    (optional)
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <LucideTimer className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="estimated_duration"
                    type="text"
                    {...register("estimated_duration")}
                  />
                </InputGroup>
              </Field>
              {errors.estimated_duration && (
                <p className="text-red-600 text-sm">
                  {errors.estimated_duration.message}
                </p>
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
            {interview ? (
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
                    Adding Interview...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Add Interview
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
