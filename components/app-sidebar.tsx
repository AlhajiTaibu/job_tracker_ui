"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  totalJobs: number;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Briefcase, label: "Applications", href: "/applications" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: TrendingUp, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar({ totalJobs }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-full w-16 flex-col items-center border-r border-border bg-sidebar py-6 lg:w-56 lg:items-start lg:px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="hidden text-lg font-semibold text-foreground lg:block">
          JobTracker
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden lg:block">{item.label}</span>
              {item.label === "Applications" && (
                <span className="ml-auto hidden rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground lg:block">
                  {totalJobs}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex w-full flex-col gap-4">
        <div className="flex items-center justify-center lg:justify-start lg:px-2">
          <ThemeToggle />
        </div>
        <div className="hidden w-full rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 lg:block">
          <p className="text-xs font-medium text-foreground">Pro tip</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep your applications organized by updating statuses regularly.
          </p>
        </div>
      </div>
    </aside>
  );
}
