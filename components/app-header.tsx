"use client";

import { Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hamburger } from "@/components/ui/hamburger";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { JobStatus, Profile } from "@/lib/types";
import { useNotificationBanner } from "@/hooks/use-notification";
import { useState, useEffect } from "react";
import { NotificationBell } from "./notification-bell";

type Notification = {
  id: number;
  title: string;
  body: string;
  read?: boolean;
};

type HeaderProps = {
  headerTitle: string;
  headerDescription: string;
  searchQuery: string;
  profile: Profile;
  setSearchQuery: (value: string) => void;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddNew: (value: JobStatus) => void;
};

export function AppHeader({
  headerTitle,
  headerDescription,
  searchQuery,
  profile,
  setSearchQuery,
  setMobileOpen,
  onAddNew,
}: HeaderProps) {
  const { message, dismiss } = useNotificationBanner();
  const router = useRouter();
  const initials =
    `${profile?.first_name} ${profile?.last_name}`
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "JD";

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!message) return;

    setNotifications((current) => {
      const exists = current.some((item) => item.id === message.id);
      if (exists) return current;

      return [{ ...message, read: false }, ...current];
    });
  }, [message]);

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <Hamburger setMobileOpen={() => setMobileOpen((prev) => !prev)} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">
            {headerTitle}
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {headerDescription}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => onAddNew("saved")}
          className="sm:hidden"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:w-64"
          />
        </div>

        <Button onClick={() => onAddNew("saved")} className="hidden sm:flex">
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
        {profile && (
          <button
            onClick={() => router.push("/settings")}
            className="inline-flex rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Avatar className="h-9 w-9 ">
              <AvatarImage
                src={profile?.avatar_url || ""}
                alt={initials || "User avatar"}
              />
              <AvatarFallback className="bg-primary/10 text-lg text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </div>
    </header>
  );
}
