"use client";
import { createContext, useContext } from "react";

/**
 * Base URLs for the legacy SPA frontends the dashboard links out to. These come
 * from server-side runtime env (LEGACY_*), injected once at the dashboard layout
 * and read here so client components don't need build-time-inlined NEXT_PUBLIC_*
 * values. Changing a URL is a config/redeploy, not an image rebuild.
 */
export interface LegacyUrls {
  adminUrl: string;
  librarianUrl: string;
  playPrizeEntryUrl: string;
}

const LegacyUrlsContext = createContext<LegacyUrls>({
  adminUrl: "",
  librarianUrl: "",
  playPrizeEntryUrl: "",
});

export function LegacyUrlsProvider({
  value,
  children,
}: {
  value: LegacyUrls;
  children: React.ReactNode;
}) {
  return (
    <LegacyUrlsContext.Provider value={value}>
      {children}
    </LegacyUrlsContext.Provider>
  );
}

export function useLegacyUrls() {
  return useContext(LegacyUrlsContext);
}
