"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useHandleMarkNotificationAsRead,
  useHandleMarkAllNotificationAsRead,
  useHandleDeleteNotification,
} from "@/hooks/use-notification";
import { Notification } from "@/lib/types";

type Props = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export function NotificationBell({ notifications, setNotifications }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { handleMarkNotificationAsRead } = useHandleMarkNotificationAsRead();
  const { handleMarkAllNotificationAsRead } =
    useHandleMarkAllNotificationAsRead();
  const { handleDeleteNotification } = useHandleDeleteNotification();

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <div className="relative overflow-visible" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 min-w-[20px] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 right-auto z-[9999] mt-3  w-[calc(100vw-24px)] max-w-[360px] -translate-x-4/5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 sm:left-auto sm:right-0 sm:w-[320px] sm:max-w-none sm:translate-x-0 dark:border-slate-700 dark:bg-slate-900">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No notifications
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-800 sm:px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                      Notifications
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {unreadCount} unread
                    </p>
                  </div>

                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAllNotificationAsRead();
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, is_read: true })),
                        );
                      }}
                      className="shrink-0 text-[11px] font-medium text-green-600 transition hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-2">
                {unreadNotifications.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 sm:text-[11px]">
                      Unread
                    </div>

                    <div className="space-y-1.5">
                      {unreadNotifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkNotificationAsRead(item.id);
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === item.id ? { ...n, is_read: true } : n,
                              ),
                            );
                          }}
                          className="group flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                        >
                          <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate pr-2 text-sm font-semibold text-slate-900 dark:text-white break-words">
                                  {item.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300 sm:mt-1 break-words">
                                  {item.message}
                                </p>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(item.id);
                                  setNotifications((prev) =>
                                    prev.filter((n) => n.id !== item.id),
                                  );
                                }}
                                className="mt-0.5 shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label="Remove notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {readNotifications.length > 0 && (
                  <div>
                    <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Read
                    </div>

                    <div className="space-y-1">
                      {readNotifications.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:gap-3 sm:px-3 sm:py-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate pr-2 text-sm font-medium text-slate-700 dark:text-slate-300 break-words">
                                  {item.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm text-slate-400 dark:text-slate-500 break-words">
                                  {item.message}
                                </p>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(item.id);
                                  setNotifications((prev) =>
                                    prev.filter((n) => n.id !== item.id),
                                  );
                                }}
                                className="mt-0.5 shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label="Remove notification"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
