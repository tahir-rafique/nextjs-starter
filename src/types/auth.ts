import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

/* ── Extend NextAuth types to include custom fields ─────────── */
declare module "next-auth" {
  interface Session {
    user: {
      id:   string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:   string;
    role: UserRole;
  }
}

/* ── Roles ──────────────────────────────────────────────────── */
export type UserRole = "user" | "admin" | "moderator";

export const USER_ROLES: Record<UserRole, UserRole> = {
  user:      "user",
  admin:     "admin",
  moderator: "moderator",
} as const;

/* ── Auth state (Context / Redux) ───────────────────────────── */
export interface AuthState {
  user:          AuthUser | null;
  isAuthenticated: boolean;
  isLoading:     boolean;
  error:         string | null;
}

export interface AuthUser {
  id:    string;
  name:  string;
  email: string;
  image: string | null;
  role:  UserRole;
}
