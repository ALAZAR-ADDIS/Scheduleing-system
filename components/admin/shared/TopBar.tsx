"use client";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

export default function TopBar() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-4 md:px-6 gap-4 shrink-0">
      <NotificationDropdown open={notifOpen} onToggle={() => setNotifOpen((o) => !o)} />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-orange-400 grid place-items-center text-white text-xs font-bold">AR</div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-800 leading-tight">Alex Rivera</p>
          <p className="text-xs text-gray-400">Super Admin</p>
        </div>
      </div>
    </header>
  );
}
