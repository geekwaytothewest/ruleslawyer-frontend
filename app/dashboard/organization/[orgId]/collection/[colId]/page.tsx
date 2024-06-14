"use client";
import GameGrid from "@/components/game/game-grid";
import React from "react";

export default function OrgCollectionView({
  params,
}: {
  params: { colId: string, orgId: string };
}) {
  return (
    <div>
      <GameGrid collectionId={params.colId} organizationId={params.orgId} />
    </div>
  );
}
