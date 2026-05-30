"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaUserFriends } from "react-icons/fa";
import { FaClock, FaWeightHanging } from "react-icons/fa6";

function formatRange(min: any, max: any): string | null {
  if (min == null && max == null) {
    return null;
  }

  if (min != null && max != null) {
    return min === max ? `${min}` : `${min}–${max}`;
  }

  return `${min ?? max}`;
}

export default function BoardGameGeek(props: any) {
  let { game: gameIn } = props;

  const [game, setData]: any = useState(gameIn ?? null);
  const session: any = useAuth();

  useEffect(() => {
    if (gameIn?.bggId !== undefined) {
      setData(gameIn);
    } else if (gameIn?.id) {
      frontendFetch("GET", "/game/" + gameIn.id, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => setData(data))
        .catch(() => {});
    }
  }, [gameIn, session?.data?.token]);

  if (!game || !game.bggId) return <div></div>;

  const players = formatRange(game.minPlayers, game.maxPlayers);
  const time = formatRange(game.minTime, game.maxTime);

  return (
    <div className="flex flex-wrap items-center w-full text-sm mt-2">
      {players ? (
        <span className="inline-flex items-center mr-3 mb-1" aria-label={`${players} players`}>
          <FaUserFriends className="mr-1" aria-hidden="true" />
          {players}
        </span>
      ) : null}
      {time ? (
        <span className="inline-flex items-center mr-3 mb-1" aria-label={`${time} minutes`}>
          <FaClock className="mr-1" aria-hidden="true" />
          {time} min
        </span>
      ) : null}
      {game.weight != null ? (
        <span className="inline-flex items-center mr-3 mb-1" aria-label={`Weight ${Number(game.weight).toFixed(2)} out of 5`}>
          <FaWeightHanging className="mr-1" aria-hidden="true" />
          {Number(game.weight).toFixed(2)}
        </span>
      ) : null}
      <a
        href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label="View on BoardGameGeek (opens in new tab)"
        className="inline-flex items-center mb-1 text-bggorange hover:text-gwblue"
      >
        BGG
        <FaExternalLinkAlt className="ml-1" aria-hidden="true" />
      </a>
    </div>
  );
}
