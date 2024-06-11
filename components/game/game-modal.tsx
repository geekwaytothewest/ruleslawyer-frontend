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
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CopyBubbles from "../copy/copy-bubbles";
import usePermissions from "@/utilities/swr/usePermissions";

export default function GameModal(props: any) {
  let { gameIn, gameId, disclosure } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [bubbles, setBubbles]: any = useState(null);
  const [gameName, setGameName]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const [trigger, setTrigger]: any = useState(0);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onCopyModalClose = () => {
    setTrigger(trigger + 1);
  };

  const copyDisclosure = useDisclosure({
    onClose: onCopyModalClose,
  });

  const onDelete = () => {
    if (confirm("Are you sure you want to delete this collection?")) {
      frontendFetch("DELETE", "/game/" + game.id, null, session?.data?.token)
        .then((res: any) => {
          onClose();
        })
        .catch((err: any) => {});
    }
  };

  const onSave = () => {
    frontendFetch(
      "PUT",
      "/game/" + game.id,
      { name: gameName },
      session?.data?.token
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        onClose();
      })
      .catch((err: any) => {});
  };

  useEffect(() => {
    if (gameIn && trigger === 0) {
      setData(gameIn);
      setGameName(gameIn.name);
      setBubbles(<CopyBubbles game={gameIn} disclosure={copyDisclosure} />);
      setLoading(false);
    } else {
      frontendFetch("GET", "/game/" + (game !== null ? game.id : gameId), null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setGameName(data.name);
          setBubbles(<CopyBubbles game={data} disclosure={copyDisclosure} />);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
    // copyDisclosure is not a dependancy - remove a warning and prevent errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIn, gameId, session?.data?.token, trigger]);

  useEffect(() => {
    if (permissions.user) {
      if (
        permissions.organizations.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId == game?.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      }

      setLoading(false);
    }
  }, [permissions, game]);

  if (isLoading || isLoadingPermissions) return <div>Loading...</div>;
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
              {!readOnly && game.copies.length === 0 ? (
                <Button color="danger" onPress={onDelete}>
                  Delete
                </Button>
              ) : (
                ""
              )}
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
