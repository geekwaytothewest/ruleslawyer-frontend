"use client";
import GameGrid from "@/components/game/game-grid";
import React, { use } from "react";

type Params = Promise<{ colId: string }>;

// Read-only collection view (no org in the URL). GameGrid derives the
// organization from the fetched collection.
export default function CollectionView(props: { params: Params }) {
  const params = use(props.params);

  return (
    <div>
      <GameGrid collectionId={Number(params.colId)} showHeader={true} />
    </div>
  );
}
