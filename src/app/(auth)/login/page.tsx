import type { Metadata } from "next";

import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title:       "Sign In",
  description: "Sign in to your account.",
  robots:      { index: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
