"use client";

import React from "react";
import { VscSignIn } from "react-icons/vsc";

export function SignIn() {
  return (
    <button
      onClick={() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/login`;
      }}
      className="hover:text-gwgreen"
    >
      <span className="text-5xl">
        <VscSignIn className="inline-block" /> Sign In
      </span>
    </button>
  );
}
