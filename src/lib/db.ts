/**
 * MongoDB Atlas connection with singleton pattern for Next.js.
 * Reuses the cached connection across hot-reloads in dev and
 * serverless invocations in production.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/* ── Global cache (survives hot-reloads in dev) ─────────────── */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/* ── Options ────────────────────────────────────────────────── */
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxPoolSize:    10,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  family: 4,
};

/* ── connectDB ──────────────────────────────────────────────── */
export async function connectDB(): Promise<mongoose.Connection> {
  if (!MONGODB_URI) {
    throw new Error("⚠️  Please define MONGODB_URI in your .env.local file.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, MONGOOSE_OPTIONS)
      .then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/* ── disconnectDB (useful for tests) ───────────────────────── */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn   = null;
    cached.promise = null;
  }
}

export default connectDB;
