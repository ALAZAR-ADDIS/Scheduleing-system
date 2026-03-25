"use client";
import { useRef, useEffect, useState } from "react";
import { Bell, Calendar, UserPlus, CheckCircle, User } from "lucide-react";

type NotifType = "appointment" | "client" | "status";

type Notif = {
  id: number;
  type: NotifType;
  text: string;
  bold?: string;
  time: string;
  read: boolean;
};

const ICON_MAP = {
  appointment: Calendar,
  client:      UserPlus,
  status:      CheckCircle,
};

const INITIAL: Notif[] = [
  { id: 1, type: "appointment", text: "New appointment booked by",      bold: "Alex Thompson",  time: "10 minutes ago", read: false },
  { id: 2, type: "client",      text: "New client assigned to you:",    bold: "Jane Smith",     time: "1 hour ago",     read: false },
  { id: 3, type: "appointment", text: "Upcoming appointment with",      bold: "David Miller",   time: "2 hours ago",    read: false },
  { id: 4, type: "status",      text: "Appointment marked completed by", bold: "Elena Rodriguez", time: "Yesterday",     read: true  },
  { id: 5, type: "client",      text: "Client rescheduled session:",    bold: "Tom Baker",      time: "2 days ago",     read: true  },
];

export default function EmployeeNotificationDropdown() {
  const [open,   setOpen]   = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);
  const ref    = useRef<HTMLDivElement>(null);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Bell size={18} className="text-gray-500" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-orange-500">
            <span className="text-white font-semibold text-sm">Notifications</span>
            <button type="button" onClick={markAllRead}
              className="text-white text-xs font-medium hover:underline">
              MARK ALL AS READ
            </button>
          </div>

          <ul className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
            {notifs.map(n => {
              const Icon = ICON_MAP[n.type];
              return (
                <li key={n.id}
                  className={`flex items-start gap-3 px-4 py-2 transition-colors ${n.read ? "opacity-60" : "hover:bg-orange-50"}`}>
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
                  {!n.read && <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 shrink-0" />}
                </li>
              );
            })}
          </ul>

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
