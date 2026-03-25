"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCheck, UserCog, LogOut, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import TopBar from "@/components/admin/shared/TopBar";
import { useLogout } from "@/state/hooks/useLogout";

const navItems    = [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }];
const generalItems = [
  { label: "Clients",             href: "/admin/clients",  icon: Users },
  { label: "Employee",            href: "/admin/employee", icon: UserCheck },
  { label: "Manage User Account", href: "/admin/accounts", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useLogout();
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className={`border-b border-gray-100 ${(!mobile && collapsed) ? "px-3.5 py-5 flex justify-center" : "px-4 py-5 flex items-center justify-between"}`}>
        {(!mobile && collapsed)
          ? <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center"><LayoutDashboard size={15} className="text-white" /></div>
          : <>
              <div>
                <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Super Admin</p>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
              {mobile && (
                <button type="button" onClick={() => setMobileOpen(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
                  <X size={16} />
                </button>
              )}
            </>
        }
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className={`pt-4 space-y-1 ${(!mobile && collapsed) ? "px-2" : "px-3"}`}>
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} title={(!mobile && collapsed) ? label : undefined}
              className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${(!mobile && collapsed) ? "px-2.5 py-2 justify-center" : "px-3 py-2"} ${
                pathname === href ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
              }`}>
              <Icon size={16} className="shrink-0" />
              {(mobile || !collapsed) && label}
            </Link>
          ))}
        </nav>

        <div className={`pt-6 ${(!mobile && collapsed) ? "px-2" : "px-3"}`}>
          {(mobile || !collapsed) && <p className="text-xs text-gray-400 uppercase tracking-widest px-3 mb-2">General</p>}
          {(!mobile && collapsed) && <div className="border-t border-gray-100 mb-2 mx-1" />}
          <nav className="space-y-1">
            {generalItems.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} title={(!mobile && collapsed) ? label : undefined}
                className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${(!mobile && collapsed) ? "px-2.5 py-2 justify-center" : "px-3 py-2"} ${
                  pathname === href ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`}>
                <Icon size={16} className="shrink-0" />
                {(mobile || !collapsed) && label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className={`pb-5 ${(!mobile && collapsed) ? "px-2" : "px-3"}`}>
        <button type="button" onClick={logout} title={(!mobile && collapsed) ? "Logout" : undefined}
          className={`flex items-center gap-3 w-full rounded-md text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors ${(!mobile && collapsed) ? "px-2.5 py-2 justify-center" : "px-3 py-2"}`}>
          <LogOut size={16} className="shrink-0" />
          {(mobile || !collapsed) && "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col border-r border-gray-200 transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`relative hidden md:flex flex-col justify-between bg-white border-r border-gray-200 shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}>
        <button type="button" onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-colors">
          {collapsed ? <ChevronRight size={12} className="text-gray-500" /> : <ChevronLeft size={12} className="text-gray-500" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <button type="button" onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <Menu size={20} />
          </button>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Super Admin</p>
        </div>
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
