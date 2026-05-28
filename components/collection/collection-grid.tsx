"use client";
import { Tooltip, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import CollectionCard from "./collection-card";
import CollectionModal from "./collection-modal";
import { TbPackageImport } from "react-icons/tb";
import usePermissions from "@/utilities/swr/usePermissions";

export default function CollectionGrid(props: any) {
  let { collectionsIn, organizationId } = props;

  const [collections, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useAuth();

  useEffect(() => {
    if (permissions.user?.data) {
      if (permissions.user.data.superAdmin) {
        setReadOnly(false);
      } else if (organizationId) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          setReadOnly(true);
        }
      } else {
        setReadOnly(true);
      }
    }
  }, [permissions.user?.data, permissions.organizations?.data, organizationId]);

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
                onDeleted={onModalClose}
              />
            );
          }
        )}
      </div>

      {readOnly ? (
        ""
      ) : (
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
      )}

      {readOnly ? (
        ""
      ) : (
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
      )}

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
