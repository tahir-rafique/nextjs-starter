/**
 * NextAuth.js v4 configuration.
 * Supports credentials, Google, and GitHub providers out of the box.
 * Extend with more providers as needed.
 */
import type { NextAuthOptions, User } from "next-auth";
import type { UserRole } from "@/types/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  /* ── Session strategy ────────────────────────────────────── */
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days

  /* ── JWT ─────────────────────────────────────────────────── */
  jwt: { maxAge: 30 * 24 * 60 * 60 },

  /* ── Pages ───────────────────────────────────────────────── */
  pages: {
    signIn: "/login",
    error:  "/login",
  },

  /* ── Providers ───────────────────────────────────────────── */
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();

        const user = await UserModel.findOne({ email: credentials.email }).select(
          "+password"
        );
        if (!user || !user.password) throw new Error("No account found with this email.");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Incorrect password.");

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image ?? null,
          role:  user.role,
        } as User;
      },
    }),

    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id:    profile.sub,
          name:  profile.name,
          email: profile.email,
          image: profile.picture,
          role:  "user",
        };
      },
    }),

    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id:    profile.id.toString(),
          name:  profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role:  "user",
        };
      },
    }),
  ],

  /* ── Callbacks ───────────────────────────────────────────── */
  callbacks: {
    async signIn({ user, account }) {
      // Auto-create user in DB for OAuth logins
      if (account?.provider !== "credentials") {
        await connectDB();
        const existing = await UserModel.findOne({ email: user.email });
        if (!existing) {
          await UserModel.create({
            name:     user.name,
            email:    user.email,
            image:    user.image,
            provider: account?.provider,
            role:     "user",
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as User).role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  /* ── Events ──────────────────────────────────────────────── */
  events: {
    async signIn({ user }) {
      // Track last login in DB
      await connectDB();
      await UserModel.findOneAndUpdate(
        { email: user.email },
        { lastLoginAt: new Date() }
      );
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug:  process.env.NODE_ENV === "development",
};
