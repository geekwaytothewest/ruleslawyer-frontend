"use client";
import UserGrid from "@/components/user/user-grid";
import React, { use } from "react";

type Params = Promise<{ orgId: string; conId: string }>;

export default function ConUsersView(props: { params: Params }) {
  const params = use(props.params);

  return (
    <div>
      <UserGrid conventionId={Number(params.conId)} userType="convention" />
    </div>
  );
}
