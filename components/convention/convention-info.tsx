"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CollectionCard from "../collection/collection-card";
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
import usePermissions from "@/utilities/swr/usePermissions";
import ConventionModal from "./convention-modal";
import { FaEdit } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import CollectionModal from "../collection/collection-modal";
import { TbPackageImport } from "react-icons/tb";

export default function ConventionInfo(props: any) {
  let { id, editDisclosure } = props;

  const [convention, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [collectionIdToAttach, setCollectionIdToAttach]: any = useState(null);
  const [collections, setCollections]: any = useState(null);
  const [filteredCollections, setFilteredCollections]: any = useState(null);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useSession();

  useEffect(() => {
    frontendFetch("GET", "/con/" + id, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [id, session?.data?.token]);

  useEffect(() => {
    if (permissions.user && convention) {
      if (
        permissions.organizations.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId == convention.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      } else {
        if (
          permissions.conventions.data?.filter(
            (d: { conventionId: any; admin: boolean }) =>
              d.conventionId == convention.conventionId && d.admin === true
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
  }, [permissions, convention]);

  useEffect(() => {
    if (convention && !readOnly) {
      frontendFetch(
        "GET",
        "/org/" + convention.organizationId + "/collections",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollections(data);
        })
        .catch((err: any) => {});
    }
  }, [convention, session?.data?.token, readOnly]);

  useEffect(() => {
    if (collections) {
      setFilteredCollections(
        collections?.filter(
          (c: { id: any }) =>
            convention.collections.find(
              (c2: { collectionId: any; id: any }) => c2.collectionId == c.id
            ) === undefined
        )
      );
    }
  }, [collections, convention]);

  const onModalClose = () => {
    frontendFetch("GET", "/con/" + id, null, session?.data?.token)
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
      session?.data?.token
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

  const createCollectionDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = createCollectionDisclosure;

  const importCollectionDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenImport,
    onOpen: onOpenImport,
    onClose: onCloseImport,
  } = importCollectionDisclosure;

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = editDisclosure;

  if (isLoading || isLoadingPermissions) return <div>Loading...</div>;

  return (
    <div className="relative">
      <h1>{convention.name}</h1>
      <h2>{convention.theme}</h2>
      <h3 className="flex">
        Collections:{" "}
        {readOnly ? (
          ""
        ) : (
          <div className="flex">
            <IoMdAddCircle
              className="ml-2 hover:cursor-pointer hover:text-gwgreen"
              onClick={onOpenCreate}
            />
            <TbPackageImport
              className="ml-2 hover:cursor-pointer hover:text-gwgreen"
              onClick={onOpenImport}
            />
            <GrAttachment
              className="ml-2 hover:cursor-pointer hover:text-gwgreen"
              onClick={onOpen}
            />
          </div>
        )}
      </h3>
      {readOnly ? (
        ""
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Attach Collection</ModalHeader>
            <ModalBody>
              <Select
                name="collectionSelect"
                items={filteredCollections}
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
      )}
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
      <FaEdit
        className="text-3xl absolute bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer"
        onClick={onOpenEdit}
      />
      <ConventionModal
        conventionIn={convention}
        conventionId={id}
        organizationId={convention.organizationId}
        disclosure={editDisclosure}
      />
      <CollectionModal
        disclosure={createCollectionDisclosure}
        conventionId={convention.id}
        organizationId={convention.organizationId}
      />
      <CollectionModal
        disclosure={importCollectionDisclosure}
        conventionId={convention.id}
        organizationId={convention.organizationId}
        importFile={true}
      />
    </div>
  );
}
