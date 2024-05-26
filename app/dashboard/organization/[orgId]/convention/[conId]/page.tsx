"use client";
import ConventionInfo from "@/app/components/convention/convention-info";
import React from "react";

export default function ConView({ params }: { params: { orgId: string, conId: string } }) {
  return (
    <div>
        <ConventionInfo id={params.conId} />
    </div>
  );
}
