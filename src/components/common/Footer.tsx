import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_APP_NAME ?? "App"}. All rights reserved.
        </p>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms"   className="hover:text-foreground">Terms</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
