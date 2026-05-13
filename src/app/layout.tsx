import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import AppProviders from "@/components/providers/AppProviders";
import "./globals.css";

/* ── Font ───────────────────────────────────────────────────── */
const inter = Inter({
  subsets:  ["latin"],
  display:  "swap",
  variable: "--font-sans",
});

/* ── SEO: default metadata ──────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default:  process.env.NEXT_PUBLIC_APP_NAME ?? "Next.js Boilerplate",
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME ?? "Next.js Boilerplate"}`,
  },
  description:
    "A production-ready Next.js 15 full-stack boilerplate with TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit, Context API, MongoDB Atlas, and NextAuth.",
  keywords: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "NextAuth", "Full Stack"],
  authors:  [{ name: "Tahir Rafique" }],
  creator:  "Tahir Rafique",
  openGraph: {
    type:   "website",
    locale: "en_US",
    url:    process.env.NEXT_PUBLIC_APP_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    title:    process.env.NEXT_PUBLIC_APP_NAME,
    description:
      "A production-ready Next.js 15 full-stack boilerplate.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "App preview",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       process.env.NEXT_PUBLIC_APP_NAME,
    description: "A production-ready Next.js 15 full-stack boilerplate.",
    images:      ["/og-image.png"],
  },
  robots: {
    index:        true,
    follow:       true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  icons: {
    icon:    "/favicon.ico",
    apple:   "/apple-touch-icon.png",
    shortcut:"/favicon-16x16.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor:    [{ media: "(prefers-color-scheme: light)", color: "white" },
                  { media: "(prefers-color-scheme: dark)",  color: "black" }],
  width:         "device-width",
  initialScale:  1,
};

/* ── Root layout ────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
