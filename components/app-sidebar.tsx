"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  ActivityIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Briefcase, label: "Applications", href: "/applications" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: ActivityIcon, label: "Tasks", href: "/tasks" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: TrendingUp, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

type AppSidebarProps = {
  totalJobs: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function AppSidebar({
  totalJobs,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("app-sidebar-collapsed");
    if (savedCollapsed === "true") setCollapsed(true);
  }, []);

  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }

    if (prevPathnameRef.current !== pathname) {
      onMobileClose();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, onMobileClose]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, onMobileClose]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("app-sidebar-collapsed", String(next));
      return next;
    });
  };

  const sidebarContent = (isMobile = false) => {
    const compact = !isMobile && collapsed;

    return (
      <>
        {!isMobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute right-0 top-6 z-20 flex h-5 w-5 translate-x-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        )}

        <div
          className={cn(
            "mb-6 flex w-full",
            isMobile
              ? "items-center justify-between"
              : compact
                ? "justify-center"
                : "items-center justify-start",
          )}
        >
          <Link
            href="/"
            className={cn(
              "rounded-lg transition-colors",
              compact
                ? "flex h-10 w-10 items-center justify-center"
                : "flex min-w-0 items-center gap-2 px-1",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Briefcase className="h-5 w-5 shrink-0 text-primary-foreground" />
            </div>

            {!compact && (
              <span className="truncate text-lg font-semibold text-foreground">
                JobTracker
              </span>
            )}
          </Link>

          {isMobile && (
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex w-full flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex w-full rounded-lg text-sm font-medium transition-colors",
                  compact
                    ? "h-11 items-center justify-center px-2"
                    : "items-center gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={compact ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                title={compact ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />

                {!compact && (
                  <>
                    <span className="truncate">{item.label}</span>

                    {item.label === "Applications" && (
                      <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {totalJobs}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex w-full flex-col gap-4">
          <div className="flex items-center justify-center lg:justify-start lg:px-2">
            <ThemeToggle />
          </div>

          {!compact && (
            <div className="hidden w-full rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 lg:block">
              <p className="text-xs font-medium text-foreground">Pro tip</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Keep your applications organized by updating statuses regularly.
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-border bg-sidebar px-3 py-4 shadow-xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent(true)}
      </aside>

      <aside
        className={cn(
          "relative hidden h-full shrink-0 flex-col border-r border-border bg-sidebar py-4 transition-all duration-300 md:flex",
          collapsed ? "w-[72px] items-center px-2" : "w-56 items-stretch px-3",
        )}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
