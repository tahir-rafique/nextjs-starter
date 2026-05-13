"use client";

import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

import { useAuth }        from "@/context/AuthContext";
import { useAppDispatch } from "@/store/hooks";
import { toggleSidebar }  from "@/store/slices/uiSlice";
import { cn }             from "@/lib/utils";
import { generateInitials } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm",
        className
      )}
    >
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-lg font-semibold">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}
        </Link>
      </div>

      {/* Right: theme + notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-md p-2 hover:bg-accent"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button aria-label="Notifications" className="rounded-md p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar / logout */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                generateInitials(user.name)
              )}
            </div>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
