"use client";

import React from "react";
import { Tooltip } from "@heroui/react";
import { VscSignOut } from "react-icons/vsc";

export function SignOut({ collapsed = false }: { collapsed?: boolean }) {
  const button = (
    <button onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/auth/logout`; }} className="hover:text-gwgreen hover:cursor-pointer">
      <span className="text-lg">
        <VscSignOut className="inline-block" />{!collapsed && " Sign Out"}
      </span>
    </button>
  );

  if (!collapsed) {
    return button;
  }

  return (
    <Tooltip content="Sign Out" showArrow={true} color="success" delay={1000}>
      {button}
    </Tooltip>
  );
}
