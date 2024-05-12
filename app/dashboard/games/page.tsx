import { auth } from "@/auth";
import beFetch from "@/utilities/beFetch";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let games: any = [];

  if (session?.user.email) {
    games = await beFetch("GET", "/game");
  }

  return (
    <div>
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
          return <div key={g.id}>{g.name}</div>;
        }
      )}
    </div>
  );
}
