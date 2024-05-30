import React from "react";
import { signIn } from "@/auth";
import { VscSignIn } from "react-icons/vsc";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("auth0");
      }}
    >
      <button type="submit" className="hover:text-gwgreen">
        <span className="text-5xl">
          <VscSignIn className="inline-block" /> Sign In
        </span>
      </button>
    </form>
  );
}
