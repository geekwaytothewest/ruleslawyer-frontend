"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import React, { Key, useEffect, useState } from "react";
import CollectionCard from "../collection/collection-card";
import { MdLibraryAdd } from "react-icons/md";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { GrAttachment } from "react-icons/gr";

export default function ConventionInfo(props: any) {
  let { id } = props;

  const [convention, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collectionIdToAttach, setCollectionIdToAttach]: any = useState(null);
  const [collections, setCollections]: any = useState(null);

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    frontendFetch("GET", "/con/" + id, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [id, session]);

  useEffect(() => {
    if (convention) {
      frontendFetch(
        "GET",
        "/org/" + convention.organizationId + "/collections",
        null,
        session
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [convention, session]);

  const onModalClose = () => {
    frontendFetch("GET", "/con/" + id, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  };

  const onSave = () => {
    frontendFetch(
      "POST",
      "/con/" + id + "/conventionCollection/" + collectionIdToAttach,
      {},
      session
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        onClose();
      })
      .catch((err: any) => {});
  };

  const disclosure = useDisclosure({
    onClose: onModalClose,
  });
  const { isOpen, onOpen, onClose } = disclosure;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{convention.name}</h1>
      <h2>{convention.theme}</h2>
      <h3 className="flex">
        Collections:{" "}
        <GrAttachment className="ml-2 hover:cursor-pointer" onClick={onOpen} />{" "}
      </h3>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Attach Collection</ModalHeader>
          <ModalBody>
            <Select
              name="collectionSelect"
              items={collections?.filter(
                (c: { id: any }) =>
                  convention.collections.find(
                    (c2: { id: any }) => c2.id == c.id
                  ) == undefined
              )}
              label="Collection to Attach"
              placeholder="Select a collection"
              onChange={(event) => {
                setCollectionIdToAttach(Number(event.target.value));
              }}
            >
              {(collection: any) => (
                <SelectItem key={collection.id} value={collection.name}>
                  {collection.name}
                </SelectItem>
              )}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onPress={onSave}>
              Attach
            </Button>
            <Button color="primary" onPress={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-wrap">
        {convention.collections.map(
          (c: {
            collection: {
              _count: any;
              id: React.Key | null | undefined;
              name:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined;
            };
          }) => {
            return (
              <div key={c.collection.id}>
                <CollectionCard
                  collectionIn={c.collection}
                  conventionId={convention.id}
                  onDeleted={onClose}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
