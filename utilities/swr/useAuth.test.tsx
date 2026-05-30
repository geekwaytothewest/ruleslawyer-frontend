import { renderHook } from "@testing-library/react";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import { useAuth } from "@/utilities/swr/useAuth";

jest.mock("swr");
// @auth0/nextjs-auth0 is auto-mocked via <rootDir>/__mocks__ (its package ships
// only an ESM export condition jest's CJS resolver can't load), exposing a
// shared useUser jest.fn() this suite drives directly.

const useUserMock = useUser as jest.Mock;
const useSWRMock = useSWR as jest.Mock;

describe("useAuth", () => {
  beforeEach(() => {
    useUserMock.mockReset();
    useSWRMock.mockReset();
  });

  it("reports 'loading' while auth0 is resolving and skips the token request", () => {
    useUserMock.mockReturnValue({ user: undefined, isLoading: true });
    useSWRMock.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe("loading");
    // No user yet -> SWR key is null so no token fetch fires.
    expect(useSWRMock.mock.calls[0][0]).toBeNull();
    expect(result.current.data.token).toBeUndefined();
  });

  it("reports 'unauthenticated' when loading finishes with no user", () => {
    useUserMock.mockReturnValue({ user: undefined, isLoading: false });
    useSWRMock.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe("unauthenticated");
    expect(useSWRMock.mock.calls[0][0]).toBeNull();
  });

  it("reports 'authenticated' and builds the token key once a user exists", () => {
    const user = { email: "u@test.dev" };
    useUserMock.mockReturnValue({ user, isLoading: false });
    useSWRMock.mockReturnValue({ data: { token: "tok" } });

    const { result } = renderHook(() => useAuth());

    expect(result.current.status).toBe("authenticated");
    // Key is the token endpoint, optionally prefixed by NEXT_PUBLIC_BASE_PATH.
    expect(useSWRMock.mock.calls[0][0]).toMatch(/\/api\/auth\/token$/);
    expect(result.current.data).toEqual({ token: "tok", user });
  });
});
