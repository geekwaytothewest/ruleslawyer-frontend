import dynamic from "next/dynamic";
import React from "react";

const GameGrid = dynamic(() => import("@/app/components/game/game-grid"), {
  loading: () => <p>Loading...</p>,
});

export default async function Dashboard() {
  return (
    <GameGrid />
  );
}
