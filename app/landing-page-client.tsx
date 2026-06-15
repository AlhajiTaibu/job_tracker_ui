"use client";

import { useState, useEffect } from "react";
import { clientPost } from "@/lib/client-auth";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Presentation,
  Users,
  ActivityIcon,
  FileText,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Analytics", href: "#analytics" },
];

export default function LandingPageClient() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: profileData } = useProfile();
  const profile = profileData?.payload ?? null;
  const isAuthenticated = !!profile;
  const queryClient = useQueryClient();

  const initials =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JD";

  const handleLogOut = async () => {
    setServerError("");
    setIsLoading(true);

    try {
      await clientPost<{ message?: string }>("/api/auth/logout", {});
      queryClient.setQueryData(["profile"], null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Log out failed");
    } finally {
      setIsLoading(false);
      setServerError("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:py-5">
          <div
            onClick={() => router.push("/")}
            className="flex min-w-0 items-center gap-3 hover:cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Briefcase className="h-5 w-5 shrink-0 text-primary-foreground" />
            </div>
            <span className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              JobTracker
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-slate-900 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={profile?.avatar_url || ""}
                      alt={profile?.first_name || "User avatar"}
                    />
                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button onClick={handleLogOut} disabled={isLoading}>
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[290px] p-0">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b px-5 py-4">
                    <div
                      onClick={() => router.push("/")}
                      className="flex items-center gap-3 hover:cursor-pointer"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                        <Briefcase className="h-5 w-5 shrink-0 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-semibold tracking-tight">
                        JobTracker
                      </span>
                    </div>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </div>

                  <div className="flex-1 px-3 py-4">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>

                    <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div
                          onClick={() => router.push("/dashboard")}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={profile?.avatar_url || ""}
                              alt={profile?.first_name || "User avatar"}
                            />
                            <AvatarFallback className="bg-primary/10 text-lg text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                              {`${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
                                "Your Account"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Open dashboard
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleLogOut}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          onClick={() => router.push("/login")}
                          className="w-full"
                        >
                          Login
                        </Button>
                        <Button
                          onClick={() => router.push("/register")}
                          className="w-full"
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            Organize your job search with clarity
          </div>

          <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Track every job application in one place
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
            Manage applications, interviews, contacts, tasks, and documents in a
            clean visual workflow built to help you stay focused and land
            faster.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {isAuthenticated ? (
              <Button onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => router.push("/register")}>
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("#features")}
                >
                  View Features
                </Button>
              </>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Applications", "Track every role"],
              ["Interviews", "Stay prepared"],
              ["Analytics", "Measure progress"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {title}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Dashboard
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  3 active out of 3 total
                </p>
              </div>
              <Button>Add Application</Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { stage: "Applied", items: [] },
                { stage: "Screening", items: [] },
                { stage: "Assessment", items: ["Software Developer"] },
                {
                  stage: "Interview",
                  items: ["Backend Engineer", "Python Developer"],
                },
              ].map((col) => (
                <div
                  key={col.stage}
                  className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {col.stage}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      {col.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {col.items.length === 0 ? (
                      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 sm:min-h-[180px]">
                        No applications
                      </div>
                    ) : (
                      col.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item}
                          </div>
                          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Track notes, contacts, and updates
                          </div>
                          <div className="mt-4 text-xs font-medium text-green-600 dark:text-green-400">
                            View job
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
          {[
            [
              "Visual pipeline",
              "See where every application stands at a glance.",
            ],
            [
              "Stay organized",
              "Manage tasks, interviews, contacts, and documents.",
            ],
            [
              "Track progress",
              "Understand your job search performance over time.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60"
            >
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Everything you need to manage your job search
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Built to keep your opportunities structured, visible, and easy to
            act on.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Application Tracking",
              text: "Organize jobs by stage from applied to offer.",
              icon: Briefcase,
            },
            {
              title: "Interview Management",
              text: "Keep every interview and follow-up in one place.",
              icon: Presentation,
            },
            {
              title: "Contacts",
              text: "Store recruiter and referral details for each role.",
              icon: Users,
            },
            {
              title: "Tasks",
              text: "Track reminders so nothing gets missed.",
              icon: ActivityIcon,
            },
            {
              title: "Documents",
              text: "Manage resumes, cover letters, and related files.",
              icon: FileText,
            },
            {
              title: "Analytics",
              text: "Measure activity and monitor your progress clearly.",
              icon: TrendingUp,
            },
          ].map((data) => (
            <div
              key={data.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 h-11 w-11 ">
                <data.icon className="h-5 w-5 shrink-0" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {data.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {data.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              How it works
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              A simple workflow to help you stay consistent from first
              application to final offer.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "1. Add applications",
                "Save jobs and start tracking them immediately.",
              ],
              [
                "2. Move through stages",
                "Update progress as roles move from screening to interview and offer.",
              ],
              [
                "3. Stay prepared",
                "Attach notes, tasks, and contacts so every opportunity is easy to manage.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/60"
              >
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="analytics"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              See your progress clearly
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              Monitor how many roles you have applied to, how many reached
              interview stage, and where your job search is gaining momentum.
            </p>
            <Button
              onClick={() =>
                router.push(isAuthenticated ? "/dashboard" : "/register")
              }
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Tracking Now"}
            </Button>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["24", "Applications sent"],
                ["8", "Interview invites"],
                ["5", "Active follow-ups"],
                ["2", "Offers received"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60"
                >
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {value}
                  </div>
                  <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20">
        <div className="rounded-[32px] border border-green-100 bg-green-50 px-6 py-10 text-center dark:border-green-900 dark:bg-green-950/30 sm:px-8 sm:py-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Stay organized throughout your job search
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Create your free account and manage every opportunity with a
            workflow designed for clarity and momentum.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogOut}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/register")}>
                  Create Account
                </Button>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
