"use client";
import GameGrid from "@/components/game/game-grid";
import React, { use } from "react";

type Params = Promise<{ orgId: string; colId: string }>;

export default function OrgCollectionView(props: { params: Params }) {
  const params = use(props.params);

  return (
    <div>
      <GameGrid collectionId={params.colId} organizationId={params.orgId} />
    </div>
  );
}
