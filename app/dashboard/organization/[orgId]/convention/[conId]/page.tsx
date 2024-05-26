"use client";
import ConventionInfo from "@/app/components/convention/convention-info";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function ConView({ params }: { params: { orgId: string, conId: string } }) {
  return (
    <div>
        <ConventionInfo id={params.conId} />
    </div>
  );
}
