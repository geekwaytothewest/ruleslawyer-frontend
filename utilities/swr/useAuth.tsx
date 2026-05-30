"use client";

import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";

export function useAuth() {
  const { user, isLoading } = useUser();
  const { data: tokenData } = useSWR(
    // Auth0 SDK's built-in access-token endpoint (under /auth/*). NOT /api/* —
    // at the apex, CloudFront routes /api/* to the backend, so a dashboard route
    // there would be unreachable. Returns { token, scope, expires_at }.
    user ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/access-token` : null,
    (url) => fetch(url).then((r) => r.json()),
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  return {
    data: { token: tokenData?.token, user: user },
    status: isLoading ? "loading" : user ? "authenticated" : "unauthenticated",
  };
}
