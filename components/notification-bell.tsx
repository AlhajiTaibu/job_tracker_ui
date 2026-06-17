"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Notification = {
  id: number;
  title: string;
  body: string;
  read?: boolean;
};

type Props = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export function NotificationBell({ notifications, setNotifications }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function markAsRead(id: number) {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  function remove(id: number) {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 min-w-[20px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] max-w-80 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 sm:w-80">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
              No notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`flex cursor-pointer items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 transition-colors ${
                  item.read
                    ? "bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800"
                    : "bg-slate-50 border-slate-100 dark:bg-slate-800/60 dark:border-slate-800"
                }`}
              >
                <div className="flex gap-3">
                  {!item.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}

                  <div>
                    <p
                      className={`text-sm ${
                        item.read
                          ? "font-normal text-slate-600 dark:text-slate-300"
                          : "font-semibold text-slate-900 dark:text-white"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-sm ${
                        item.read
                          ? "text-slate-400 dark:text-slate-500"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(item.id);
                  }}
                  className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
                  aria-label="Remove notification"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
