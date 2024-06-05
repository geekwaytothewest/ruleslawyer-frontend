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
  let { copyIn, copyId, disclosure } = props;

  const [copy, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collections, setCollections]: any = useState(null);
  const [copyCollectionId, setCopyCollectionId]: any = useState(null);
  const [copyWinnable, setCopyWinnable]: any = useState(null);
  const [copyBarcode, setCopyBarcode]: any = useState(null);
  const [copyBarcodeLabel, setCopyBarcodeLabel]: any = useState(null);
  const [copyComments, setCopyComments]: any = useState(null);
  const [gameId, setGameId]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const { permissions, isLoading: isLoadingPermissions, isError }: any = usePermissions();

  const session: any = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
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
  };

  let gameList = useAsyncList<game>({
    async load({ signal, filterText }) {
      if (filterText && filterText.length > 3) {
        let res = await frontendFetch(
          "GET",
          `/org/${copy.organizationId}/games/search/${filterText}`,
          null,
          session?.data?.token,
          signal
        );
        let json = await res.json();

        return {
          items: json,
        };
      } else {
        return { items: [] };
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
    } else {
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

        setLoading(false);
      }

      setLoading(false);
    }
  }, [permissions, copy]);

  useEffect(() => {
    if (copy) {
      frontendFetch(
        "GET",
        "/org/" + copy.organizationId + "/collections",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [copy, session]);

  if (isLoading || isLoadingPermissions) return <div></div>;
  if (!copy) return <div></div>;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader>
              {copy.game.name} ({copy.barcodeLabel})
            </ModalHeader>
            <ModalBody>
              <Select
                name="collectionSelect"
                items={collections}
                label="Current collection"
                placeholder="Select a collection"
                defaultSelectedKeys={[copy.collectionId]}
                isDisabled={readOnly}
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
                onSelectionChange={(key: React.Key | null) =>
                  setGameId(key?.valueOf())
                }
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                )}
              </Autocomplete>
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
              {copy.collection?.allowWinning && (
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
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
