"use client";

import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";

export function useAuth() {
  const { user, isLoading } = useUser();
  const { data: tokenData } = useSWR(
    user ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth/token` : null,
    (url) => fetch(url).then((r) => r.json())
  );

  return {
    data: { token: tokenData?.token, user: user },
    status: isLoading ? "loading" : user ? "authenticated" : "unauthenticated",
  };
}
