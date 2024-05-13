"use client";
import React, { useEffect, useState } from "react";
import { BsBox2Heart } from "react-icons/bs";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/modal";
import GameModal from "./game-modal";

export default function GameCard(props: any) {
  let { gameIn, gameId } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const disclosure = useDisclosure();
  const { isOpen, onOpen, onClose } = disclosure;

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (gameIn) {
      setData(gameIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [gameIn, gameId, session]);

  if (isLoading) return <div>Loading...</div>;
  if (!game) return <div>No game data</div>;

  return (
    <div>
      <div
        onClick={onOpen}
        className="flex items-center border-2 w-64 h-24 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50]"
      >
        <div className="flex-col p-3 w-24">
          <BsBox2Heart size={64} />
        </div>
        <div className="flex-col pr-3 w-full">
          <span className="inline-block align-middle h-full">
            {game.name !== "" ? game.name : "[unknown name]"}
          </span>
        </div>
      </div>
      <GameModal disclosure={disclosure} gameIn={game} gameId={game.id} />
    </div>
  );
}
