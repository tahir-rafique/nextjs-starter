import type { Metadata } from "next";

import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title:       "Create Account",
  description: "Create a new account.",
  robots:      { index: false },
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground">Start your journey today</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
