"use client";

import React from "react";
import { VscSignIn } from "react-icons/vsc";

export function SignIn() {
  return (
    <button
      onClick={() => {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        const returnTo = encodeURIComponent(`${basePath}/dashboard`);
        window.location.href = `${basePath}/auth/login?returnTo=${returnTo}`;
      }}
      className="hover:text-gwgreen"
    >
      <span className="text-5xl">
        <VscSignIn aria-hidden="true" className="inline-block" /> Sign In
      </span>
    </button>
  );
}
