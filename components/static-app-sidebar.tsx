import {
  ActivityIcon,
  Briefcase,
  FileText,
  LayoutDashboard,
  Presentation,
  Settings,
  TrendingUp,
  Users,
  Link,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function StaticAppSidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Briefcase, label: "Applications", active: false },
    { icon: Presentation, label: "Interviews", active: false },
    { icon: Users, label: "Contacts", active: false },
    { icon: ActivityIcon, label: "Tasks", active: false },
    { icon: FileText, label: "Documents", active: false },
    { icon: TrendingUp, label: "Analytics", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const sidebarContent = (isMobile = false) => {
    const compact = isMobile;

    return (
      <>
        {!isMobile && (
          <button
            type="button"
            className="absolute right-0 top-6 z-20 flex h-5 w-5 translate-x-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          ></button>
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
          <div
            // href="/"
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
          </div>

          {isMobile && (
            <button
              type="button"
              // onClick={onMobileClose}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex w-full flex-1 flex-col gap-1.5">
          {items.map((item) => {
            return (
              <div
                key={item.label}
                // href={item.href}
                className={cn(
                  "flex w-full rounded-lg text-sm font-medium transition-colors",
                  compact
                    ? "h-11 items-center justify-center px-2"
                    : "items-center gap-3 px-3 py-2.5",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                // aria-label={compact ? item.label : undefined}
                // aria-current={isActive ? "page" : undefined}
                // title={compact ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />

                {!compact && (
                  <>
                    <span className="truncate">{item.label}</span>

                    {item.label === "Applications" && (
                      <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {2}
                      </span>
                    )}
                  </>
                )}
              </div>
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
      {/* {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            // onClick={onMobileClose}
            aria-hidden="true"
          />
        )} */}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-border bg-sidebar px-3 py-4 shadow-xl transition-transform duration-300 md:hidden",
          // mobileOpen ? "translate-x-0" :
          "-translate-x-full",
        )}
      >
        {sidebarContent(true)}
      </aside>

      <aside
        className={cn(
          "relative hidden h-full shrink-0 flex-col border-r border-border bg-sidebar py-4 transition-all duration-300 md:flex",
          // collapsed
          //   ? "w-[72px] items-center px-2"
          //   :
          "w-56 items-stretch px-3",
        )}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
