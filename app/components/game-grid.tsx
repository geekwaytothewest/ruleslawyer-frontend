import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import React from "react";
import GameCard from "./game-card";

export default async function GameGrid() {
  const resp = await backendFetch("GET", "/game");
  const games = await resp.json();

  games.sort((a: { name: string }, b: { name: string }) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-wrap">
      {games.map(
        (g: {
          id: React.Key | null | undefined;
          name:
            | string
            | number
            | bigint
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Promise<React.AwaitedReactNode>
            | null
            | undefined;
        }) => {
          return <GameCard key={g.id} gameIn={g} gameId={g.id} />;
        }
      )}
    </div>
  );
}
