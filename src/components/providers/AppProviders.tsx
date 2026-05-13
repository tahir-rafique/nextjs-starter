"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider }   from "next-themes";
import { Toaster }         from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { UIProvider }   from "@/context/UIContext";
import ReduxProvider    from "./ReduxProvider";

/**
 * AppProviders — single component that wraps the entire tree.
 * Order matters: Redux → Session → Auth → UI → Theme
 */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SessionProvider>
        <AuthProvider>
          <UIProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors closeButton position="top-right" />
            </ThemeProvider>
          </UIProvider>
        </AuthProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
