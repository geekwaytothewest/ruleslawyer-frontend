"use client";
import GameGrid from "@/components/game/game-grid";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function OrgCollectionView({
  params,
}: {
  params: { orgId: string; colId: string };
}) {
  const session: any = useSession();

  return (
    <div>
      <GameGrid collectionId={params.colId} organizationId={params.orgId} showHeader={true} />
    </div>
  );
}
