"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { useDisclosure } from "@heroui/modal";
import GameModal from "./game-modal";
import { Skeleton } from "@heroui/react";
import { BiSolidMessageAltError } from "react-icons/bi";
import CopyBubbles from "../copy/copy-bubbles";
import { IoLibrary } from "react-icons/io5";
import usePermissions from "@/utilities/swr/usePermissions";

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

  const session: any = useSession();

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
  }, [gameIn, gameId, session]);

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
          <IoLibrary size={64} />
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
