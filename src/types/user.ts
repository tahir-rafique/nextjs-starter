import type { UserRole } from "./auth";

export interface User {
  _id:         string;
  name:        string;
  email:       string;
  image:       string | null;
  role:        UserRole;
  provider:    "credentials" | "google" | "github";
  isVerified:  boolean;
  bio?:        string;
  createdAt:   string;
  updatedAt:   string;
  lastLoginAt?: string;
}

export type CreateUserInput = Omit<User, "_id" | "createdAt" | "updatedAt" | "lastLoginAt">;
export type UpdateUserInput = Partial<Pick<User, "name" | "image" | "bio">>;

export type UserListItem = Pick<User, "_id" | "name" | "email" | "image" | "role" | "isVerified" | "createdAt">;
