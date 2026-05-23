import React from "react";
import { VscSignOut } from "react-icons/vsc";

export function SignOut() {
  return (
    <button onClick={() => { window.location.href = "/auth/logout"; }} className="hover:text-gwgreen">
      <span className="text-lg">
        <VscSignOut className="inline-block" /> Sign Out
      </span>
    </button>
  );
}
