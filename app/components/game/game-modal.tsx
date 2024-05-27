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
import CopyBubbles from "../copy/copy-bubbles";

export default function GameModal(props: any) {
  let { gameIn, gameId, disclosure } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [bubbles, setBubbles]: any = useState(null);
  const [gameName, setGameName]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const [user, setUser]: any = useState(null);
  const [isLoadingUser, setLoadingUser]: any = useState(true);

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
      setBubbles(<CopyBubbles game={game} />);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + gameId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setGameName(game.name);
          setBubbles(<CopyBubbles game={game} />);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [gameIn, gameId, session, game]);

  useEffect(() => {
    frontendFetch("GET", "/user/" + session?.data?.user?.email, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch((err: any) => {});
  }, [session]);

  useEffect(() => {
    if (user) {
      frontendFetch("GET", "/userOrgPerm/" + user.id, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          if (
            data.filter(
              (d: { organizationId: any; admin: boolean }) =>
                d.organizationId === game.organizationId && d.admin === true
            ).length > 0
          ) {
            setReadOnly(false);
          } else {
            setReadOnly(true);
          }

          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [user, session, game]);

  if (isLoading) return <div>Loading...</div>;
  if (!game) return <div>No game data</div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {game.name !== "" ? game.name : "[unknown name]"}
            </ModalHeader>
            <ModalBody>
              {game.name != "" ? (
                <Input
                  name="gameName"
                  type="text"
                  isRequired
                  label="Game Name"
                  value={gameName}
                  onValueChange={(value) => setGameName(value)}
                  isDisabled={readOnly}
                />
              ) : (
                ""
              )}

              {bubbles}
            </ModalBody>
            <ModalFooter>
              {readOnly ? (
                ""
              ) : (
                <Button color="success" onPress={onSave}>
                  Save
                </Button>
              )}
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
