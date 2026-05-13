"use client";

import { Home, Users, Settings, BarChart3, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn }             from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSidebarOpen } from "@/store/slices/uiSlice";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard",           icon: Home },
  { label: "Users",     href: "/dashboard/users",     icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings",  href: "/dashboard/settings",  icon: Settings },
] as const;

export default function Sidebar() {
  const pathname  = usePathname();
  const dispatch  = useAppDispatch();
  const isOpen    = useAppSelector((s) => s.ui.sidebarOpen);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo row */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {isOpen && (
          <span className="font-bold text-lg truncate">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
          </span>
        )}
        <button
          onClick={() => dispatch(setSidebarOpen(!isOpen))}
          aria-label="Collapse sidebar"
          className="rounded-md p-1.5 hover:bg-accent ml-auto"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isOpen && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
