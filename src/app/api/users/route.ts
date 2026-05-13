import { getServerSession } from "next-auth";

import {
  apiForbidden,
  apiPaginated,
  apiServerError,
  apiUnauthorized,
  apiValidationError,
} from "@/lib/api-response";
import { authOptions }      from "@/lib/auth";
import connectDB            from "@/lib/db";
import { paginationSchema } from "@/lib/validations";
import UserModel            from "@/models/User";

/**
 * GET /api/users
 * Admin-only: list all users with pagination, search, and sorting.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiUnauthorized();
    if (session.user.role !== "admin") return apiForbidden();

    const { searchParams } = new URL(req.url);
    const parsed = paginationSchema.safeParse(
      Object.fromEntries(searchParams.entries())
    );
    if (!parsed.success) return apiValidationError(parsed.error.errors);

    const { page, limit, sort = "createdAt", order, q } = parsed.data;
    const skip = (page - 1) * limit;

    await connectDB();

    const filter = q
      ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] }
      : {};

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return apiPaginated(users, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    console.error("[GET /api/users]", err);
    return apiServerError();
  }
}
