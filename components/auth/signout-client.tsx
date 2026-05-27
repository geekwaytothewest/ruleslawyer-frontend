"use client";

import React from "react";
import { VscSignOut } from "react-icons/vsc";

export function SignOut({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <button onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/logout`; }} className="hover:text-gwgreen hover:cursor-pointer" aria-label="Sign Out" title="Sign Out">
      <span className="text-lg">
        <VscSignOut className="inline-block" />{!collapsed && " Sign Out"}
      </span>
    </button>
  );
}
