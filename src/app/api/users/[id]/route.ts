import { getServerSession } from "next-auth";

import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiServerError,
  apiSuccess,
  apiUnauthorized,
} from "@/lib/api-response";
import { authOptions }         from "@/lib/auth";
import connectDB               from "@/lib/db";
import { updateProfileSchema } from "@/lib/validations";
import UserModel               from "@/models/User";

// Next.js 15: dynamic route params are a Promise
type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/users/:id
 * Returns a single user. Own profile or admin.
 */
export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return apiUnauthorized();

    const isOwn   = session.user.id === id;
    const isAdmin = session.user.role === "admin";
    if (!isOwn && !isAdmin) return apiForbidden();

    await connectDB();
    const user = await UserModel.findById(id).lean();
    if (!user) return apiNotFound("User not found.");

    return apiSuccess(user);
  } catch (err) {
    console.error("[GET /api/users/:id]", err);
    return apiServerError();
  }
}

/**
 * PATCH /api/users/:id
 * Partial update — own profile or admin.
 */
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return apiUnauthorized();

    const isOwn   = session.user.id === id;
    const isAdmin = session.user.role === "admin";
    if (!isOwn && !isAdmin) return apiForbidden();

    const body   = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Validation failed.",
        parsed.error.errors.reduce(
          (a, e) => ({ ...a, [e.path.join(".")]: [e.message] }),
          {} as Record<string, string[]>
        )
      );
    }

    await connectDB();
    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return apiNotFound("User not found.");

    return apiSuccess(updated, 200, "Profile updated successfully.");
  } catch (err) {
    console.error("[PATCH /api/users/:id]", err);
    return apiServerError();
  }
}

/**
 * DELETE /api/users/:id
 * Admin only.
 */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return apiUnauthorized();
    if (session.user.role !== "admin") return apiForbidden();

    await connectDB();
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return apiNotFound("User not found.");

    return apiSuccess(null, 200, "User deleted successfully.");
  } catch (err) {
    console.error("[DELETE /api/users/:id]", err);
    return apiServerError();
  }
}
