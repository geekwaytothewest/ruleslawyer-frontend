"use client";
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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CopyBubbles from "./copy-bubbles";

export default function GameModal(props: any) {
  let { gameIn, gameId, disclosure } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [bubbles, setBubbles]: any = useState(null);
  const [gameName, setGameName]: any = useState(null);

  const session = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    frontendFetch("PUT", "/game/" + game.id, { name: gameName }, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        onClose();
      })
      .catch((err: any) => {});
  };

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (gameIn) {
      setData(gameIn);
      setGameName(gameIn.name);
      setBubbles(<CopyBubbles copiesIn={gameIn.copies} gameId={gameIn.id} />);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setGameName(game.name);
          setBubbles(<CopyBubbles copiesIn={game.copies} gameId={game.id} />);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [gameIn, gameId, session, game]);

  if (isLoading) return <div>Loading...</div>;
  if (!game) return <div>No game data</div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader>
              {game.name !== "" ? game.name : "[unknown name]"}
            </ModalHeader>
            <ModalBody>
              <Input
                id="gameName"
                type="text"
                isRequired
                label="Game Name"
                value={gameName}
                onValueChange={(value) => setGameName(value)}
              />
              {bubbles}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onSave}>
                Save
              </Button>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
