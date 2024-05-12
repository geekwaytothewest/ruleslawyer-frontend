import { signOut } from "next-auth/react";
import React from "react";

export function SignOut() {
  return <button onClick={() => signOut()} className="hover:text-gwgreen">Sign Out</button>;
}
