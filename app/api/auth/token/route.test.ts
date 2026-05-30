/**
 * @jest-environment node
 */
// next/server's NextResponse needs the web Request/Response globals, which the
// node test environment provides (via undici) but jsdom does not.
import { GET } from "@/app/api/auth/token/route";
import { auth0 } from "@/lib/auth0";

// Factory-mock @/lib/auth0 so the real module (which imports the ESM-only
// @auth0/nextjs-auth0/server) never loads under jest's CJS resolver.
jest.mock("@/lib/auth0", () => ({
  auth0: { getAccessToken: jest.fn() },
}));

const getAccessTokenMock = auth0.getAccessToken as jest.Mock;

describe("GET /api/auth/token", () => {
  beforeEach(() => getAccessTokenMock.mockReset());

  it("returns the access token as JSON on success", async () => {
    getAccessTokenMock.mockResolvedValue({ token: "tok" });

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ token: "tok" });
  });

  it("returns a 401 with a null token when the token cannot be retrieved", async () => {
    getAccessTokenMock.mockRejectedValue(new Error("no session"));

    const res = await GET();

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ token: null });
  });
});
