"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useLogout } from "@/state/hooks/useLogout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { href: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/client/booking",   label: "Booking",   icon: CalendarDays },
  ];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 border-b border-gray-100 shrink-0 ${(!mobile && collapsed) ? "px-3.5 py-5 justify-center" : "px-5 py-5"}`}>
        <div className="w-9 h-9 rounded-xl bg-orange-500 grid place-items-center shrink-0">
          <LayoutDashboard size={18} className="text-white" />
        </div>
        {(mobile || !collapsed) && (
          <div>
            <p className="text-sm font-bold text-gray-800 leading-tight">Client Portal</p>
            <p className="text-xs text-orange-500 font-medium">Business Suite</p>
          </div>
        )}
        {mobile && (
          <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-1 ${(!mobile && collapsed) ? "px-2" : "px-3"}`}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link key={href} href={href}
              onClick={() => setMobileOpen(false)}
              title={(!mobile && collapsed) ? label : undefined}
              className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-colors ${(!mobile && collapsed) ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"} ${
                active ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              <Icon size={16} className="shrink-0" />
              {(mobile || !collapsed) && label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`pb-5 ${(!mobile && collapsed) ? "px-2" : "px-3"}`}>
        <Link href="#" onClick={e => { e.preventDefault(); logout(); }} title={(!mobile && collapsed) ? "Logout" : undefined}
          className={`flex items-center gap-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors ${(!mobile && collapsed) ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"}`}>
          <LogOut size={16} className="shrink-0" />
          {(mobile || !collapsed) && "Logout"}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-gray-100 transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`relative hidden md:flex flex-col bg-white border-r border-gray-100 shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-52"}`}>
        <button type="button" onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-colors">
          {collapsed ? <ChevronRight size={12} className="text-gray-500" /> : <ChevronLeft size={12} className="text-gray-500" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar hamburger */}
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-gray-100 px-4 py-3 shrink-0">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 grid place-items-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-800">Client Portal</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
