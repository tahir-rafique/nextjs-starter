"use client";

/**
 * AuthContext — wraps NextAuth session into a convenient React context.
 * Keeps Redux auth slice in sync automatically.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { useAppDispatch } from "@/store/hooks";
import { clearAuth, setUser } from "@/store/slices/authSlice";
import type { AuthUser, UserRole } from "@/types/auth";

/* ── Context value shape ────────────────────────────────────── */
interface AuthContextValue {
  user:              AuthUser | null;
  isAuthenticated:   boolean;
  isLoading:         boolean;
  login:             (email: string, password: string) => Promise<{ error?: string }>;
  loginWithProvider: (provider: "google" | "github") => Promise<void>;
  logout:            () => Promise<void>;
  hasRole:           (role: UserRole | UserRole[]) => boolean;
}

/* ── Context ────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Provider ───────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch  = useAppDispatch();
  const isLoading = status === "loading";

  /* Memoised user object — only rebuilds when individual session fields change */
  const user = useMemo<AuthUser | null>(() => {
    if (!session?.user) return null;
    return {
      id:    session.user.id,
      name:  session.user.name  ?? "",
      email: session.user.email ?? "",
      image: session.user.image ?? null,
      role:  session.user.role,
    };
  }, [
    session?.user?.id,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
    session?.user?.role,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync session → Redux store */
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [user, status, dispatch]);

  /* ── Actions ────────────────────────────────────────────────── */
  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", { redirect: false, email, password });
    return { error: result?.error ?? undefined };
  }, []);

  const loginWithProvider = useCallback(async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/dashboard" });
  }, []);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
    dispatch(clearAuth());
  }, [dispatch]);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user]
  );

  /* ── Context value ──────────────────────────────────────────── */
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithProvider,
      logout,
      hasRole,
    }),
    [user, isLoading, login, loginWithProvider, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ── Hook ───────────────────────────────────────────────────── */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default AuthContext;
