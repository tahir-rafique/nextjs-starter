/**
 * Standardised API response helpers for Next.js Route Handlers.
 *
 * Usage:
 *   return apiSuccess(data, 200);
 *   return apiError("Not found", 404);
 */
import { NextResponse } from "next/server";

import type { ApiResponse, PaginatedResponse, PaginationMeta } from "@/types/api";

/* ── Success ────────────────────────────────────────────────── */
export function apiSuccess<T>(
  data: T,
  status = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

/* ── Paginated success ──────────────────────────────────────── */
export function apiPaginated<T>(
  data: T[],
  meta: PaginationMeta,
  status = 200
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status });
}

/* ── Error ──────────────────────────────────────────────────── */
export function apiError(
  message: string,
  status = 500,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ success: false, data: null, message, errors }, { status });
}

/* ── Common shortcuts ───────────────────────────────────────── */
export const apiBadRequest    = (msg = "Bad request",         errors?: Record<string, string[]>) => apiError(msg, 400, errors);
export const apiUnauthorized  = (msg = "Unauthorized")                                           => apiError(msg, 401);
export const apiForbidden     = (msg = "Forbidden")                                              => apiError(msg, 403);
export const apiNotFound      = (msg = "Resource not found")                                     => apiError(msg, 404);
export const apiConflict      = (msg = "Resource already exists")                                => apiError(msg, 409);
export const apiServerError   = (msg = "Internal server error")                                  => apiError(msg, 500);

/* ── Validation error from Zod ──────────────────────────────── */
export function apiValidationError(
  zodErrors: { path: (string | number)[]; message: string }[]
): NextResponse<ApiResponse<null>> {
  const errors = zodErrors.reduce(
    (acc, { path, message }) => {
      const key = path.join(".");
      return { ...acc, [key]: [...(acc[key] ?? []), message] };
    },
    {} as Record<string, string[]>
  );
  return apiBadRequest("Validation failed.", errors);
}

/* ── withErrorHandler wrapper ───────────────────────────────── */
type RouteHandler<T = unknown> = (
  req: Request,
  ctx: { params: Record<string, string> }
) => Promise<NextResponse<T>>;

export function withErrorHandler<T>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err: unknown) {
      console.error("[API Error]", err);
      if (err instanceof Error) {
        return apiError(err.message, 500) as NextResponse<T>;
      }
      return apiServerError() as NextResponse<T>;
    }
  };
}
