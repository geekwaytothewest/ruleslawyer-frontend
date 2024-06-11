"use client";
import { Tooltip, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import CollectionCard from "./collection-card";
import CollectionModal from "./collection-modal";
import { TbPackageImport } from "react-icons/tb";

export default function CollectionGrid(props: any) {
  let { collectionsIn, organizationId } = props;

  const [collections, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useSession();

  useEffect(() => {
    if (collectionsIn) {
      setData(collectionsIn);
      setLoading(false);
    } else {
      frontendFetch(
        "GET",
        "/org/" + organizationId + "/collections",
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [collectionsIn, organizationId, session?.data?.token]);

  const onModalClose = () => {
    frontendFetch(
      "GET",
      "/org/" + organizationId + "/collections",
      null,
      session?.data?.token
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  };

  const createDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = createDisclosure;

  const importDisclosure = useDisclosure({
    onClose: onModalClose,
  });

  const {
    isOpen: isOpenImport,
    onOpen: onOpenImport,
    onClose: onCloseImport,
  } = importDisclosure;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-wrap">
        {collections?.map(
          (c: { id: React.Key | null | undefined; name: string }) => {
            return (
              <CollectionCard
                key={c.id}
                collectionIn={c}
                id={c.id}
                onDeleted={onModalClose}
              />
            );
          }
        )}
      </div>
      <Tooltip
        content="Import Collection"
        showArrow={true}
        color="success"
        delay={1000}
      >
        <span className="text-7xl fixed bottom-28 right-8 hover:text-gwgreen hover:cursor-pointer">
          <TbPackageImport onClick={onOpenImport} />
        </span>
      </Tooltip>
      <Tooltip
        content="Create Collection"
        showArrow={true}
        color="success"
        delay={1000}
      >
        <span className="text-7xl fixed bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer">
          <IoMdAddCircle onClick={onOpenCreate} />
        </span>
      </Tooltip>

      <CollectionModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      ></CollectionModal>

      <CollectionModal
        disclosure={importDisclosure}
        organizationId={organizationId}
        importFile={true}
      ></CollectionModal>
    </div>
  );
}
