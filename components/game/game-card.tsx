"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utilities/swr/useAuth";
import frontendFetch from "@/utilities/frontendFetch";
import { useDisclosure } from "@heroui/modal";
import GameModal from "./game-modal";
import { Skeleton } from "@heroui/react";
import { BiSolidMessageAltError } from "react-icons/bi";
import CopyBubbles from "../copy/copy-bubbles";
import { IoLibrary } from "react-icons/io5";
import usePermissions from "@/utilities/swr/usePermissions";
import BoardGameGeek from "../boardgamegeek/board-game-geek";
import { GameWithCopies } from "@/types/models";

function getCoverArtSrc(coverArt: unknown): string | null {
  if (!coverArt) return null;
  if (typeof coverArt === "string") return coverArt;
  if (typeof coverArt !== "object") return null;

  let bytes: number[] | null = null;
  const buffer = coverArt as { type?: string; data?: number[] };

  if (buffer.type === "Buffer" && buffer.data != null) {
    // Standard JSON.stringify(Buffer) format: {type: "Buffer", data: [...]}
    bytes = Array.from(buffer.data);
  } else {
    // Numeric-keyed object: {"0": 255, "1": 216, ...}
    const numeric = coverArt as Record<string, number>;
    const keys = Object.keys(numeric);

    if (keys.length > 0 && keys.every((k) => !isNaN(Number(k)))) {
      bytes = keys.sort((a, b) => Number(a) - Number(b)).map((k) => numeric[k]);
    }
  }

  if (!bytes || bytes.length === 0) {
    return null;
  }

  const u8 = new Uint8Array(bytes);
  let mimeType = "image/jpeg";

  if (u8[0] === 0x89 && u8[1] === 0x50) {
    mimeType = "image/png";
  } else if (u8[0] === 0x47 && u8[1] === 0x49) {
    mimeType = "image/gif";
  }

  const binary = Array.from(u8).map((b) => String.fromCharCode(b)).join("");

  return `data:${mimeType};base64,${btoa(binary)}`;
}

interface GameCardProps {
  gameIn?: GameWithCopies;
  gameId: number;
  archived?: boolean;
}

function GameCard(props: GameCardProps) {
  const { gameIn, gameId, archived } = props;

  const [game, setData] = useState<GameWithCopies | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const { permissions } = usePermissions();

  useEffect(() => {
    if(archived) {
      setReadOnly(true);
    } else if (permissions.user?.data) {
      if (permissions.user.data.superAdmin) {
        setReadOnly(false);
      } else if (game) {
        if (
          permissions.organizations.data?.filter(
            (d) =>
              d.organizationId == game.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          setReadOnly(true);
        }
      } else {
        setReadOnly(true);
      }
    } else {
      setReadOnly(true);
    }
  }, [permissions.user?.data, permissions.organizations?.data, game]);

  const session = useAuth();

  const onModalClose = () => {
    frontendFetch("GET", "/game/" + gameId, null, session?.data?.token)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {});
  };

  const disclosure = useDisclosure({
    onClose: onModalClose,
  });
  const { isOpen, onOpen, onClose } = disclosure;

  const coverArtSrc = React.useMemo(
    () => getCoverArtSrc(game?.coverArt),
    [game?.coverArt]
  );

  useEffect(() => {
    if (gameIn) {
      setData(gameIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId, null, session?.data?.token)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((err) => {});
    }
  }, [gameIn, gameId, session?.data?.token]);

  if (isLoading) {
    return (
      <div className="flex items-center border-2 w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] border-slate-800">
        <div className="flex-col p-3 w-24">
          <IoLibrary size={64} className="text-slate-800" />
        </div>
        <div className="flex-col pr-3 w-full">
          <Skeleton className="rounded-lg">
            <div className="inline-block align-middle h-full"></div>
          </Skeleton>
        </div>
      </div>
    );
  }

  if (!game) {
    return "";
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={(readOnly ? "View " : "Edit ") + (game.name !== "" ? game.name : "game")}
        onClick={
          readOnly
            ? () => {
                alert("Not Yet Implmeneted.");
              }
            : onOpen
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (readOnly) {
              alert("Not Yet Implmeneted.");
            } else {
              onOpen();
            }
          }
        }}
        className="flex items-center border-2 border-gwblue w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] cursor-pointer"
      >
        <div className="flex-col p-3 w-24">
          {coverArtSrc ? (
            <img src={coverArtSrc} alt={game.name} className="w-full h-full object-cover" />
          ) : (
            <IoLibrary size={64} />
          )}
        </div>
        <div className="flex-col pr-3 w-full">
          <span className="inline-block align-middle h-full">
            <span className="font-bold">{game.name !== "" ? game.name : "[unknown name]"}</span>

            <BoardGameGeek game={game} />

            <CopyBubbles
              game={game}
              disclosure={disclosure}
              bubbleStyle={"statusOnly"}
              archived={archived}
            />
          </span>
        </div>
      </div>
      <GameModal disclosure={disclosure} gameIn={game} gameId={game.id} />
    </div>
  );
}

export default React.memo(GameCard);
