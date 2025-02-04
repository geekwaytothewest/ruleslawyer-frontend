import dynamic from "next/dynamic";
import React, { useEffect } from "react";

const GameGrid = dynamic(() => import("@/components/game/game-grid"), {
  loading: () => <p>Loading...</p>,
});

export default async function OrgGameView({
  params,
}: {
  params: { orgId: string };
}) {
  return <GameGrid organizationId={params.orgId} />;
}
