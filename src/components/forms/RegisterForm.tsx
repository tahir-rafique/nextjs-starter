"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 }     from "lucide-react";
import Link            from "next/link";
import { useRouter }   from "next/navigation";
import { useForm }     from "react-hook-form";
import { toast }       from "sonner";

import { cn }                         from "@/lib/utils";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.message ?? "Registration failed.");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const fields = [
    { id: "name",            label: "Full Name",       type: "text",     autocomplete: "name",         placeholder: "John Doe" },
    { id: "email",           label: "Email",            type: "email",    autocomplete: "email",        placeholder: "you@example.com" },
    { id: "password",        label: "Password",         type: "password", autocomplete: "new-password", placeholder: "Min. 8 characters" },
    { id: "confirmPassword", label: "Confirm Password", type: "password", autocomplete: "new-password", placeholder: "Repeat password" },
  ] as const;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {fields.map(({ id, label, type, autocomplete, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium">
              {label}
            </label>
            <input
              id={id}
              type={type}
              autoComplete={autocomplete}
              placeholder={placeholder}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                errors[id] && "border-destructive focus-visible:ring-destructive"
              )}
              {...register(id)}
            />
            {errors[id] && (
              <p className="text-xs text-destructive">{errors[id]?.message}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
