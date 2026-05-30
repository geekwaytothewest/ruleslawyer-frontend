import frontendFetch from "@/utilities/frontendFetch";

describe("frontendFetch", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.NEXT_PUBLIC_API_URL = "https://api.test";
  });

  it("rejects when no session token is provided", async () => {
    await expect(frontendFetch("GET", "/games")).rejects.toBe(
      "No token in session"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("prefixes the URL with NEXT_PUBLIC_API_URL and sends a bearer token", async () => {
    await frontendFetch("GET", "/games", undefined, "tok123");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/games");
    expect(init.method).toBe("GET");
    expect(init.headers.Authorization).toBe("Bearer tok123");
    // No body means no Content-Type header should be set.
    expect(init.headers["Content-Type"]).toBeUndefined();
    expect(init.body).toBeNull();
  });

  it("JSON-encodes the body and sets Content-Type for non-multipart requests", async () => {
    await frontendFetch("POST", "/games", { name: "Catan" }, "tok123");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ name: "Catan" }));
  });

  it("passes a multipart body through untouched without a JSON Content-Type", async () => {
    const form = new FormData();
    form.append("file", "data");

    await frontendFetch("POST", "/upload", form, "tok123", undefined, true);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe(form);
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("forwards an AbortSignal to fetch", async () => {
    const controller = new AbortController();
    await frontendFetch("GET", "/games", undefined, "tok123", controller.signal);

    const [, init] = fetchMock.mock.calls[0];
    expect(init.signal).toBe(controller.signal);
  });
});
