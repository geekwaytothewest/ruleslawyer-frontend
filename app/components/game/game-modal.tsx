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
import useSWR from "swr";

export default function GameModal(props: any) {
  let { gameIn, gameId, disclosure } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [bubbles, setBubbles]: any = useState(null);
  const [gameName, setGameName]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const [isLoadingUser, setLoadingUser]: any = useState(true);

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    frontendFetch("PUT", "/game/" + game.id, { name: gameName }, session?.data?.token)
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
      frontendFetch("GET", "/game/" + gameId, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setGameName(game.name);
          setBubbles(<CopyBubbles game={game} />);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [gameIn, gameId, session?.data?.token, game]);

  const user = useSWR(session?.data?.user?.email ?
    ["GET", "/user/" + session?.data?.user?.email, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const userOrgPerm = useSWR(user?.data?.id ?
    ["GET", "/userOrgPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const userConPerm = useSWR(user?.data?.id ?
    ["GET", "/userConPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  useEffect(() => {
    if (user) {
      if (
        userOrgPerm.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId === game?.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      }

      setLoading(false);
    }
  }, [user, userConPerm, userOrgPerm, game]);

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
