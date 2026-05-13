import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the Next.js Full Stack Boilerplate.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Next.js Full-Stack <br />
          <span className="text-primary">Boilerplate</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Production-ready starter with TypeScript · Tailwind CSS · shadcn/ui ·
          Redux Toolkit · Context API · MongoDB Atlas · NextAuth · Jest / RTL ·
          Vercel deployment.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Sign In
        </Link>
      </div>

      {/* Tech stack badges */}
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {[
          "Next.js 15", "TypeScript", "Tailwind CSS", "shadcn/ui",
          "Redux Toolkit", "Context API", "MongoDB Atlas", "NextAuth",
          "Jest & RTL", "Vercel",
        ].map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </main>
  );
}
