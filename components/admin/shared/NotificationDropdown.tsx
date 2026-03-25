"use client";
import { Bell, Calendar, UserPlus, User } from "lucide-react";
import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markAllRead } from "@/features/notifications/notificationsSlice";
import type { Notification } from "@/features/notifications/types";

const ICON_MAP = {
  appointment: Calendar,
  client:      UserPlus,
  user:        User,
};

export default function NotificationDropdown({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const dispatch  = useAppDispatch();
  const notifs    = useAppSelector((s) => s.notifications.items);
  const unread    = notifs.filter((n) => !n.read).length;
  const ref       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={18} className="text-gray-500" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-orange-500">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <button
              type="button"
              onClick={() => dispatch(markAllRead())}
              className="text-white text-xs font-medium hover:underline"
            >
              MARK ALL AS READ
            </button>
          </div>

          {/* Items */}
          <ul className="divide-y divide-gray-50">
            {notifs.map((n: Notification) => {
              const Icon = ICON_MAP[n.type];
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                    n.read ? "opacity-60" : "hover:bg-orange-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 grid place-items-center shrink-0 mt-0.5">
                    <Icon size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">
                      {n.text}
                      {n.bold && <> <span className="font-semibold">{n.bold}</span></>}
                    </p>
                    <p className="text-xs text-orange-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5 text-center">
            <button type="button" className="text-sm text-orange-500 font-medium hover:underline">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
