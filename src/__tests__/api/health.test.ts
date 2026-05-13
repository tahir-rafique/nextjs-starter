/**
 * Integration-style test for GET /api/health.
 * We mock connectDB to avoid a real DB connection in CI.
 */
import { GET } from "@/app/api/health/route";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

describe("GET /api/health", () => {
  it("returns 200 with ok status when DB connects", async () => {
    const response = await GET();
    const body     = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.services.database).toBe("connected");
    expect(body.services.api).toBe("ok");
    expect(body.timestamp).toBeDefined();
  });

  it("returns 503 when DB is unavailable", async () => {
    const { default: connectDB } = await import("@/lib/db");
    (connectDB as jest.Mock).mockRejectedValueOnce(new Error("DB down"));

    const response = await GET();
    const body     = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("degraded");
    expect(body.services.database).toBe("disconnected");
  });
});
