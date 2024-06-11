"use client";
import frontendFetch from "@/utilities/frontendFetch";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useAsyncList } from "@react-stately/data";
import usePermissions from "@/utilities/swr/usePermissions";

type game = {
  id: number;
  name: string;
};

export default function CopyModal(props: any) {
  let { copyIn, copyId, organizationId, disclosure } = props;

  const [copy, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collections, setCollections]: any = useState(null);
  const [copyCollectionId, setCopyCollectionId]: any = useState(null);
  const [copyWinnable, setCopyWinnable]: any = useState(false);
  const [copyBarcode, setCopyBarcode]: any = useState(null);
  const [copyBarcodeLabel, setCopyBarcodeLabel]: any = useState(null);
  const [copyComments, setCopyComments]: any = useState(null);
  const [gameId, setGameId]: any = useState(null);
  const [newGameName, setNewGameName]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const [saveDisabled, setSaveDisabled]: any = useState(false);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onDelete = () => {
    if (copy) {
      if (confirm("Are you sure you want to delete this collection?")) {
        frontendFetch(
          "DELETE",
          "/copy/" + copy.id,
          null,
          session?.data?.token
        ).then((res: any) => {
          onClose();
        });
      }
    }
  };

  const onSave = () => {
    if (copy) {
      frontendFetch(
        "PUT",
        "/copy/" + copy.id,
        {
          collectionId: copyCollectionId,
          winnable: copyWinnable,
          barcodeLabel: copyBarcodeLabel,
          barcode: copyBarcode,
          comments: copyComments,
          gameId: Number(gameId),
        },
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          copy.collection = data.collection;
          copy.collectionId = data.collectionId;
          copy.game = data.game;
          copy.gameId = data.gameId;
          onClose();
        })
        .catch((err: any) => {});
    } else {
      const createCopyGame: any = {
        game: null,
      };

      if (gameId === "0") {
        createCopyGame.game = {
          create: {
            organizationId: Number(organizationId),
            name: newGameName,
          },
        };
      } else {
        createCopyGame.game = {
          connect: {
            id: Number(gameId),
          },
        };
      }

      frontendFetch(
        "POST",
        "/org/" + organizationId + "/col/" + copyCollectionId + "/copy",
        {
          winnable: copyWinnable,
          barcodeLabel: copyBarcodeLabel,
          barcode: copyBarcode,
          comments: copyComments,
          ...createCopyGame,
        },
        session?.data?.token
      )
        .then((res: any) => {
          onClose();
        })
        .catch((err: any) => {});
    }
  };

  let gameList = useAsyncList<game>({
    async load({ signal, filterText }) {
      if (filterText === "--- NEW GAME ---") {
        filterText = "";
      }

      if (filterText) {
        let res = await frontendFetch(
          "GET",
          `/org/${
            copy ? copy.organizationId : organizationId
          }/games/autocomplete/${filterText}`,
          null,
          session?.data?.token,
          signal
        );
        let json = await res.json();
        json.unshift({ name: "--- NEW GAME ---", id: 0 });
        return {
          items: json,
        };
      } else {
        return { items: [{ name: "--- NEW GAME ---", id: 0 }] };
      }
    },
  });

  useEffect(() => {
    if (copyIn) {
      setData(copyIn);
      setCopyWinnable(copyIn.winnable);
      setCopyBarcodeLabel(copyIn.barcodeLabel);
      setCopyBarcode(copyIn.barcode);
      setCopyCollectionId(copyIn.collectionId);
      setGameId(copyIn.gameId);

      gameList.setFilterText(copyIn.game.name);

      setLoading(false);
    } else if (copyId) {
      frontendFetch("GET", "/copy/" + copyId, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setCopyWinnable(data.winnable);
          setCopyBarcodeLabel(data.barcodeLabel);
          setCopyBarcode(data.barcode);
          setCopyCollectionId(data.collectionId);
          setGameId(data.gameId);

          gameList.setFilterText(data.game.name);

          setLoading(false);
        })
        .catch((err: any) => {});
    } else {
      setLoading(false);
    }
    // gameList is not a dependency, ignoring this error makes a warning go away
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyIn, copy, copyId, session?.data?.token]);

  useEffect(() => {
    if (permissions.user && copy) {
      if (
        permissions.organizations.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId == copy.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      } else {
        if (
          permissions.con.data?.filter(
            (d: { conventionId: any; admin: boolean }) =>
              copy.collection.conventions.filter(
                (c: { conventionId: any }) => d.conventionId === c.conventionId
              ) && d.admin == true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          setReadOnly(true);
        }
      }
    } else if (organizationId) {
      setReadOnly(false);
    }
  }, [permissions, copy, organizationId]);

  useEffect(() => {
    if (copy || organizationId) {
      frontendFetch(
        "GET",
        "/org/" +
          (copy ? copy.organizationId : organizationId) +
          "/collections",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [organizationId, copy, session]);

  if (isLoading || isLoadingPermissions) return <div></div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <form
              onSubmit={(e) => {
                onSave();
              }}
            >
              <ModalHeader>
                {copy
                  ? copy.game.name + " (" + copy.barcodeLabel + ")"
                  : "Create Copy"}
              </ModalHeader>
              <ModalBody>
                <Select
                  name="collectionSelect"
                  items={collections}
                  label="Current collection"
                  placeholder="Select a collection"
                  defaultSelectedKeys={[copy ? copy.collectionId : null]}
                  isDisabled={readOnly}
                  isRequired
                  onChange={(event) => {
                    setCopyCollectionId(Number(event.target.value));
                  }}
                >
                  {(collection: any) => (
                    <SelectItem key={collection.id} value={collection.name}>
                      {collection.name}
                    </SelectItem>
                  )}
                </Select>
                <Autocomplete
                  name="gameAutocomplete"
                  label="Select a game"
                  placeholder="Type to search..."
                  inputValue={gameList.filterText}
                  isLoading={gameList.isLoading}
                  items={gameList.items}
                  onInputChange={gameList.setFilterText}
                  isDisabled={readOnly}
                  isRequired
                  onSelectionChange={(key: React.Key | null) =>
                    setGameId(key?.valueOf())
                  }
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {gameId === "0" ? (
                  <Input
                    name="newGameName"
                    type="text"
                    label="New Game Name"
                    value={newGameName}
                    isRequired
                    onValueChange={(value) => setNewGameName(value)}
                  />
                ) : (
                  ""
                )}
                <Input
                  name="barcodeLabel"
                  type="text"
                  isRequired
                  label="Barcode Label"
                  value={copyBarcodeLabel}
                  onValueChange={(value) => setCopyBarcodeLabel(value)}
                  isDisabled={readOnly}
                />
                <Input
                  name="barcode"
                  type="text"
                  isRequired
                  label="Barcode"
                  value={copyBarcode}
                  onValueChange={(value) => setCopyBarcode(value)}
                  isDisabled={readOnly}
                />
                <Textarea
                  name="comments"
                  label="Comments"
                  placeholder="Enter your comments"
                  value={copyComments ?? ""}
                  onValueChange={(value) => setCopyComments(value)}
                  isDisabled={readOnly}
                />
                {copy?.collection?.allowWinning && (
                  <Checkbox
                    name="allowWinning"
                    defaultSelected={copy.winnable}
                    onValueChange={(isSelected) => setCopyWinnable(isSelected)}
                    isDisabled={readOnly}
                  >
                    Winnable
                  </Checkbox>
                )}
              </ModalBody>
              <ModalFooter>
                {!readOnly && copy ? (
                  <Button color="danger" onPress={onDelete}>
                    Delete
                  </Button>
                ) : (
                  ""
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
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
