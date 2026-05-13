import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

/**
 * GET /api/health
 * Health check endpoint for uptime monitors and Vercel.
 */
export async function GET() {
  const start = Date.now();
  let dbStatus = "unknown";

  try {
    await connectDB();
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  return NextResponse.json(
    {
      status:    dbStatus === "connected" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime:    process.uptime(),
      latencyMs: Date.now() - start,
      services:  {
        database: dbStatus,
        api:      "ok",
      },
      version: process.env.npm_package_version ?? "1.0.0",
    },
    { status: dbStatus === "connected" ? 200 : 503 }
  );
}
