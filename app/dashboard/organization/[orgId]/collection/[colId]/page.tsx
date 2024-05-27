"use client";
import GameGrid from "@/app/components/game/game-grid";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OrgCollectionView({
  params,
}: {
  params: { orgId: string; colId: string };
}) {
  const [collection, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    frontendFetch("GET", "/collection/" + params.colId, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.colId, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!collection) return <p>No collection data</p>;

  const games = collection.copies?.map((copy: any) => copy.game);
  const unqiueGames = games
    ?.filter(
      (game: { id: number; name: string }, index: any) =>
        games.findIndex(
          (g: { id: number; name: string }) => g.id === game.id
        ) === index
    )
    .map((game: any) => {
      game.copies = collection.copies
        .filter((copy: any) => copy.game.id === game.id)
        .sort((a: any, b: any) => a.barcodeLabel.localeCompare(b.barcodeLabel));
      return game;
    });

  return (
    <div>
      <GameGrid gamesIn={unqiueGames} />
    </div>
  );
}
