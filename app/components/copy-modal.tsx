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
  const [copyBarcode, setCopyBarcode]: any = useState(null);
  const [copyBarcodeLabel, setCopyBarcodeLabel]: any = useState(null);
  const [copyComments, setCopyComments]: any = useState(null);

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
        barcode: copyBarcode,
        comments: copyComments,
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
      setCopyWinnable(copyIn.winnable);
      setCopyBarcodeLabel(copyIn.barcodeLabel);
      setCopyBarcode(copyIn.barcode);
      setCopyCollectionId(copyIn.collectionId);
      setLoading(false);
    } else {
      frontendFetch("GET", "/copy/" + copyId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setCopyWinnable(data.winnable);
          setCopyBarcodeLabel(data.barcodeLabel);
          setCopyBarcode(copyIn.barcode);
          setCopyCollectionId(data.collectionId);
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
                value={copyBarcodeLabel}
                onValueChange={(value) => setCopyBarcodeLabel(value)}
              />
              <Input
                id="barcode"
                type="text"
                isRequired
                label="Barcode"
                value={copyBarcode}
                onValueChange={(value) => setCopyBarcode(value)}
              />
              <Textarea
                label="Comments"
                placeholder="Enter your comments"
                value={copyComments}
                onValueChange={(value) => setCopyComments(value)}
              />
              {copy.collection?.allowWinning && (
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
