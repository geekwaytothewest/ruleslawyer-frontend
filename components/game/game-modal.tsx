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
} from "@heroui/react";
import { useAuth } from "@/utilities/swr/useAuth";
import { useEffect, useState } from "react";
import CopyBubbles from "../copy/copy-bubbles";
import usePermissions from "@/utilities/swr/usePermissions";

export default function GameModal(props: any) {
  let { gameIn, gameId, disclosure } = props;

  const [game, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [gameName, setGameName]: any = useState("");
  const [bggId, setBggId]: any = useState("");
  const [readOnly, setReadOnly]: any = useState(true);
  const [trigger, setTrigger]: any = useState(0);
  const [copyCount, setCopyCount]: any = useState(0);
  const {
    permissions,
    isLoading: isLoadingPermissions,
  }: any = usePermissions();

  const session: any = useAuth();

  const { isOpen, onClose } = disclosure;

  const onCopyModalClose = () => {
    setTrigger(trigger + 1);
  };

  const copyDisclosure = useDisclosure({
    onClose: onCopyModalClose,
  });

  const onDelete = () => {
    if (confirm("Are you sure you want to delete this collection?")) {
      frontendFetch("DELETE", "/game/" + game.id, null, session?.data?.token)
        .then(() => {
          onClose();
        })
        .catch(() => {});
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
      .catch(() => {});
  };

  const onSyncWithBGG = () => {
    frontendFetch(
      "PUT",
      "/game/" + game.id + "/syncWithBGG",
      null,
      session?.data?.token
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        onClose();
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Seed display data from the list row without a network call. A GameModal
    // is mounted (closed) inside every GameCard, so fetching here would fire
    // one request per card — defer the network calls until the modal opens.
    if (gameIn && trigger === 0) {
      setData(gameIn);
      setGameName(gameIn.name);
      setBggId(gameIn.bggId);
      setLoading(false);
    }

    if (!isOpen) return;

    if (gameIn && trigger === 0) {
      frontendFetch(
        "GET",
        "/game/" + (game !== null ? game.id : gameId) + "/copies",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCopyCount(data.length);
          setLoading(false);
        })
        .catch(() => {});
    } else {
      frontendFetch(
        "GET",
        "/game/" + (game !== null ? game.id : gameId),
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setGameName(data.name);
          setBggId(data.bggId);
          setLoading(false);
        })
        .catch(() => {});
    }
    // copyDisclosure is not a dependency - remove a warning and prevent errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, gameIn, gameId, session?.data?.token, trigger]);

  useEffect(() => {
    if (permissions.user?.data) {
      if (permissions.user.data.superAdmin) {
        setReadOnly(false);
      } else if (
        permissions.organizations?.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId == game?.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      } else {
        setReadOnly(true);
      }
      setLoading(false);
    }
  }, [permissions.user?.data, permissions.organizations?.data, game?.organizationId]);

  if (isLoading || isLoadingPermissions) return <div>Loading...</div>;
  if (!game) return <div>No game data</div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside">
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave();
            }}
          >
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

              <Input
                name="bggId"
                type="text"
                label="BoardGameGeek ID"
                value={bggId ?? ''}
                onValueChange={(value) => setBggId(value)}
              />

              <CopyBubbles game={game} disclosure={copyDisclosure} />
            </ModalBody>
            <ModalFooter>
              {!readOnly && copyCount === 0 ? (
                <Button color="danger" onPress={onDelete}>
                  Delete
                </Button>
              ) : (
                ""
              )}
              {readOnly ? (
                ""
              ) : (
                <Button color="primary" onPress={onSyncWithBGG}>
                  Sync With BGG
                </Button>
              )}
              {readOnly ? (
                ""
              ) : (
                <Button color="success" type="submit">
                  Save
                </Button>
              )}
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
