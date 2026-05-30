/**
 * @jest-environment node
 */
// next/server's NextResponse needs the web Request/Response globals, which the
// node test environment provides (via undici) but jsdom does not.
import { GET } from "@/app/auth/profile/route";
import { auth0 } from "@/lib/auth0";

// Factory-mock @/lib/auth0 so the real module (which imports the ESM-only
// @auth0/nextjs-auth0/server) never loads under jest's CJS resolver.
jest.mock("@/lib/auth0", () => ({
  auth0: { getSession: jest.fn() },
}));

const getSessionMock = auth0.getSession as jest.Mock;

describe("GET /auth/profile", () => {
  beforeEach(() => getSessionMock.mockReset());

  it("returns the session user as JSON when authenticated", async () => {
    const user = { email: "u@test.dev", name: "Mattie" };
    getSessionMock.mockResolvedValue({ user });

    const res = await GET();

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(user);
  });

  it("returns a 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const res = await GET();

    expect(res.status).toBe(401);
  });
});
