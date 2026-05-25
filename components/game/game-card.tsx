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

function getCoverArtSrc(coverArt: any): string | null {
  if (!coverArt) return null;
  if (typeof coverArt === "string") return coverArt;

  let bytes: number[] | null = null;

  if (coverArt.type === "Buffer" && coverArt.data != null) {
    // Standard JSON.stringify(Buffer) format: {type: "Buffer", data: [...]}
    bytes = Array.from(coverArt.data);
  } else if (typeof coverArt === "object") {
    // Numeric-keyed object: {"0": 255, "1": 216, ...}
    const keys = Object.keys(coverArt);
    if (keys.length > 0 && keys.every((k) => !isNaN(Number(k)))) {
      bytes = keys.sort((a, b) => Number(a) - Number(b)).map((k) => coverArt[k]);
    }
  }

  if (!bytes || bytes.length === 0) return null;

  const u8 = new Uint8Array(bytes);
  let mimeType = "image/jpeg";
  if (u8[0] === 0x89 && u8[1] === 0x50) mimeType = "image/png";
  else if (u8[0] === 0x47 && u8[1] === 0x49) mimeType = "image/gif";
  const binary = Array.from(u8).map((b) => String.fromCharCode(b)).join("");
  return `data:${mimeType};base64,${btoa(binary)}`;
}

export default function GameCard(props: any) {
  let { gameIn, gameId } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  useEffect(() => {
    if (permissions.user) {
      if (permissions.user.superAdmin) {
        setReadOnly(false);
      } else if (game) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
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
  }, [permissions, game]);

  const session: any = useAuth();

  const onModalClose = () => {
    frontendFetch("GET", "/game/" + gameId, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  };

  const disclosure = useDisclosure({
    onClose: onModalClose,
  });
  const { isOpen, onOpen, onClose } = disclosure;

  useEffect(() => {
    if (gameIn) {
      setData(gameIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
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
        onClick={
          readOnly
            ? () => {
                alert("Not Yet Implmeneted.");
              }
            : onOpen
        }
        className="flex items-center border-2 border-gwblue w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] cursor-pointer"
      >
        <div className="flex-col p-3 w-24">
          {getCoverArtSrc(game.coverArt) ? (
            <img src={getCoverArtSrc(game.coverArt)!} alt={game.name} className="w-full h-full object-cover" />
          ) : (
            <IoLibrary size={64} />
          )}
        </div>
        <div className="flex-col pr-3 w-full">
          <span className="inline-block align-middle h-full">
            {game.name !== "" ? game.name : "[unknown name]"}
            <CopyBubbles
              game={game}
              disclosure={disclosure}
              bubbleStyle={"statusOnly"}
            />
          </span>
        </div>
      </div>
      <GameModal disclosure={disclosure} gameIn={game} gameId={game.id} />
    </div>
  );
}
