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
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CopyModal(props: any) {
  let { copyIn, copyId, disclosure } = props;

  const [copy, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collections, setCollections]: any = useState(null);
  const [copyCollectionId, setCopyCollectionId]: any = useState(null);
  const [copyWinnable, setCopyWinnable]: any = useState(null);
  const [copyBarcodeLabel, setCopyBarcodeLabel]: any = useState(null);

  const session = useSession();

  const { isOpen, onOpen, onClose } = disclosure;

  const onSave = () => {
    frontendFetch(
      "PUT",
      "/copy/" + copy.id,
      {
        collectionId: copyCollectionId,
        winnable: copyWinnable,
        barcodeLabel: copyBarcodeLabel,
      },
      session
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        copy.collection = data;
        copy.collectionId = data.collectionId;
        onClose();
      })
      .catch((err: any) => {});
  };

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (copyIn) {
      setData(copyIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/copy/" + copyId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [copyIn, copy, copyId, session]);

  useEffect(() => {
    if (copy) {
      frontendFetch(
        "GET",
        "/org/" + copy.organizationId + "/collections",
        null,
        session
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [copy, session]);

  if (isLoading) return <p>Loading...</p>;
  if (!copy) return <p>No copy data</p>;

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
                items={collections}
                label="Current collection"
                placeholder="Select a collection"
                defaultSelectedKeys={[copy.collectionId]}
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
              <Input
                id="barcodeLabel"
                type="text"
                isRequired
                label="Barcode Label"
                value={copy.barcodeLabel}
                onValueChange={(value) => setCopyBarcodeLabel(value)}
              />
              {copy.collection.allowWinning && (
                <Checkbox
                  defaultSelected={copy.winnable}
                  onValueChange={(isSelected) => setCopyWinnable(isSelected)}
                >
                  Winnable
                </Checkbox>
              )}
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
