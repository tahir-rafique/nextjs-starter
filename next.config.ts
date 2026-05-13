import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Images ───────────────────────────────────────────── */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /* ── Security headers ─────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control",    value: "on" },
          { key: "X-XSS-Protection",           value: "1; mode=block" },
          { key: "X-Frame-Options",             value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",      value: "nosniff" },
          { key: "Referrer-Policy",             value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",          value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  /* ── Redirects ────────────────────────────────────────── */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /* ── Experimental / perf ─────────────────────────────── */
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  /* ── Compiler ─────────────────────────────────────────── */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  /* ── Bundle analyser (opt-in) ─────────────────────────── */
  // Uncomment to enable: ANALYZE=true next build
  // ...(process.env.ANALYZE === "true"
  //   ? { bundleAnalyzer: { enabled: true } }
  //   : {}),
};

export default nextConfig;
