"use client";
import { useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import CollectionCard from "./collection-card";
import CollectionModal from "./collection-modal";

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

  if (isLoading) return <div>Loading...</div>

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

      <IoMdAddCircle
        className="text-7xl absolute bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer"
        onClick={onOpenCreate}
      />
      <CollectionModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      ></CollectionModal>
    </div>
  );
}
