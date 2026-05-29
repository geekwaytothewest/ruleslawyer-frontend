"use client";
import { Tooltip, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import usePermissions from "@/utilities/swr/usePermissions";
import UserCard from "./user-card";
import UserModal from "./user-modal";

export default function UserGrid(props: any) {
  let { usersIn, organizationId, conventionId, userType } = props;

  const [users, setData]: any = useState(null);
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
    if (usersIn) {
      setData(usersIn);
      setLoading(false);
    } else if (organizationId) {
      frontendFetch(
        "GET",
        "/userOrgPerm/organization/" + organizationId,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    } else if (conventionId) {
      frontendFetch(
        "GET",
        "/userConPerm/convention/" + conventionId,
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
  }, [usersIn, organizationId, session?.data?.token]);

  const onModalClose = () => {
    frontendFetch(
      "GET",
      "/userOrgPerm/organization/" + organizationId,
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
        {users?.map(
          (u: { id: React.Key | null | undefined; name: string }) => {
            return (
              <UserCard
                key={u.id}
                userIn={u}
                onDeleted={onModalClose}
                userType={userType}
              />
            );
          }
        )}
      </div>

      {readOnly ? (
        ""
      ) : (
        <Tooltip
          content="Add User"
          showArrow={true}
          color="success"
          delay={1000}
        >
          <span className="text-7xl fixed bottom-8 right-8 hover:text-gwgreen hover:cursor-pointer">
            <IoMdAddCircle onClick={onOpenCreate} />
          </span>
        </Tooltip>
      )}

      <UserModal
        disclosure={createDisclosure}
        organizationId={organizationId}
      ></UserModal>
    </div>
  );
}
