"use client";
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

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    frontendFetch("GET", "/collection/" + params.colId, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.colId, session]);

  if (isLoading) return <p>Loading...</p>;
  if (!collection) return <p>No collection data</p>;

  collection.copies?.sort((a: any, b: any) =>
    a.game.name.localeCompare(b.game.name)
  );

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
      <h1>{collection.name}</h1>
      <div>
        {unqiueGames?.map((game: any) => (
          <div key={game.id} className="flex mb-5">
            <h1 className="odd:bg-gwblue-50 min-w-64 max-w-64 text-wrap">
              <Link
                href={`/dashboard/game/${game.id}`}
                className="mr-2 hover:text-gwgreen"
              >
                {game.name ? game.name : "[unknown name]"}
              </Link>
            </h1>
            <div className="ml-2 flex flex-wrap">
              (
              {game.copies.map((copy: any) => (
                <span key={copy.id} className="ml-2 mr-2">
                  <Link
                    href={`/dashboard/copy/${copy.id}`}
                    className="hover:text-gwgreen"
                  >
                    {copy.checkOuts.length === 0 ||
                    copy.checkOuts[0].checkIn !== null ? (
                      <div className="inline-block mr-2 w-4 h-4 rounded-full bg-gwgreen"></div>
                    ) : (
                      <div className="inline-block mr-2 w-4 h-4 rounded-full bg-gwred"></div>
                    )}
                    {copy.barcode.replaceAll("*", "")}
                  </Link>
                </span>
              ))}
              )
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
