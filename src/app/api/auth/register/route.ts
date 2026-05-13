import { NextResponse } from "next/server";

import {
  apiBadRequest,
  apiConflict,
  apiServerError,
  apiSuccess,
  apiValidationError,
} from "@/lib/api-response";
import connectDB          from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import UserModel          from "@/models/User";

/**
 * POST /api/auth/register
 * Creates a new credentials user.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    /* Validate */
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return apiValidationError(parsed.error.errors);

    const { name, email, password } = parsed.data;

    await connectDB();

    /* Check uniqueness */
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) return apiConflict("An account with this email already exists.");

    /* Create */
    const user = await UserModel.create({ name, email, password, provider: "credentials" });

    return apiSuccess(
      { id: user._id.toString(), email: user.email, name: user.name },
      201,
      "Account created successfully. Please sign in."
    );
  } catch (err: unknown) {
    console.error("[POST /api/auth/register]", err);
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return apiConflict("An account with this email already exists.");
    }
    return apiServerError();
  }
}
