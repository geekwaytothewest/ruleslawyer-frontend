import React from "react";
import { redirect } from "next/navigation";
import { VscSignIn } from "react-icons/vsc";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        redirect("/auth/login");
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
