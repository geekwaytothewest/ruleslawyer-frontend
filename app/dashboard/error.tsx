"use client";

import React, { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the server/browser logs instead of failing
    // silently with Next's generic "Application error" page.
    console.error(error);
  }, [error]);

  return (
    <div className="pt-5">
      <h1 className="text-gwgreen text-2xl mb-2">Something went wrong</h1>
      <p className="mb-4">
        This page failed to load. Please try again, and if it keeps happening
        let an admin know.
      </p>
      {error.digest ? (
        <p className="text-gwblue mb-4">Reference: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="hover:text-gwgreen hover:cursor-pointer underline"
      >
        Try again
      </button>
    </div>
  );
}
