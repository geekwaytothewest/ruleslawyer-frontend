import backendFetch from "@/utilities/backendFetch";
import { auth0 } from "@/lib/auth0";

// Factory-mock @/lib/auth0 so its real module (which imports
// @auth0/nextjs-auth0/server — an ESM-only export jest's CJS resolver can't
// load) never runs. We only need a stub getAccessToken.
jest.mock("@/lib/auth0", () => ({
  auth0: { getAccessToken: jest.fn() },
}));

const getAccessTokenMock = auth0.getAccessToken as jest.Mock;

describe("backendFetch", () => {
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;
  const originalApiUrl = process.env.API_URL;

  beforeEach(() => {
    getAccessTokenMock.mockReset();
    fetchMock.mockReset().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.API_URL = "https://api.test";
    getAccessTokenMock.mockResolvedValue({ token: "tok" });
  });

  afterAll(() => {
    global.fetch = originalFetch;
    process.env.API_URL = originalApiUrl;
  });

  it("prefixes the URL with API_URL and attaches the bearer token", async () => {
    await backendFetch("GET", "/con/5");

    expect(fetchMock).toHaveBeenCalledWith("https://api.test/con/5", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer tok",
      },
      body: null,
    });
  });

  it("serializes a body to JSON when one is provided", async () => {
    await backendFetch("POST", "/con", { name: "GeekWay" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ name: "GeekWay" }));
  });

  it("sends a null body when none is provided", async () => {
    await backendFetch("DELETE", "/con/5");
    expect(fetchMock.mock.calls[0][1].body).toBeNull();
  });

  it("returns the fetch response to the caller", async () => {
    const response = { ok: true, status: 200 };
    fetchMock.mockResolvedValue(response);
    await expect(backendFetch("GET", "/con/5")).resolves.toBe(response);
  });
});
