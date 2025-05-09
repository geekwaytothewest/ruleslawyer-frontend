"use client";
import ConventionInfo from "@/components/convention/convention-info";
import React, { use } from "react";

type Params = Promise<{ orgId: string; conId: string }>;

export default function ConView(props: { params: Params }) {
  const params = use(props.params);

  return (
    <div>
      <ConventionInfo id={params.conId} />
    </div>
  );
}
