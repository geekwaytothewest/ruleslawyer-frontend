import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const GameGrid = dynamic(() => import("@/components/game/game-grid"), {
  loading: () => <p>Loading...</p>,
});

type Params = Promise<{ orgId: string }>;

export default async function OrgGameView(props: { params: Params }) {
  const params = await props.params;

  return <GameGrid organizationId={params.orgId} />;
}
