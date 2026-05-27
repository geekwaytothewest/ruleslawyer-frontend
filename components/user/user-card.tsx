"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utilities/swr/useAuth";
import frontendFetch from "@/utilities/frontendFetch";
import { Skeleton, Tooltip, useDisclosure } from "@heroui/react";
import { BiSolidMessageAltError } from "react-icons/bi";
import { IoLibrary } from "react-icons/io5";
import usePermissions from "@/utilities/swr/usePermissions";
import { FaTrashCan, FaUser } from "react-icons/fa6";
import UserModal from "./user-modal";

export default function UserCard(props: any) {
  let { userIn, onDeleted } = props;

  const [user, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [readOnly, setReadOnly]: any = useState(true);
  const {
    permissions,
    isLoading: isLoadingPermissions,
    isError,
  }: any = usePermissions();

  const session: any = useAuth();

  useEffect(() => {
    if (userIn) {
      setData(userIn);
      setLoading(false);
    } else {
      frontendFetch(
        "GET",
        "/userConPerm/" + userIn.id,
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
  }, [userIn, session?.data?.token]);

  useEffect(() => {
    if (permissions.user) {
      if (permissions.user.superAdmin) {
        setReadOnly(false);
      } else if (user) {
        if (
          permissions.organizations.data?.filter(
            (d: { organizationId: any; admin: boolean }) =>
              d.organizationId == user.organizationId && d.admin === true
          ).length > 0
        ) {
          setReadOnly(false);
        } else {
          if (
            permissions.conventions.data?.filter(
              (d: { conventionId: any; admin: boolean }) =>
                user.conventions?.filter(
                  (c: { conventionId: any }) => d.conventionId == c.conventionId
                ) && d.admin === true
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
    } else {
      setReadOnly(true);
    }
  }, [permissions, user]);

  const onModalClose = () => {
    frontendFetch(
      "GET",
      "/userConPerm/" + user.id,
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

  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = disclosure;


  const deleteUser = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    userId: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (confirm("Are you sure you want to delete this user?")) {
      frontendFetch(
        "DELETE",
        "/userConPerm/" + userId,
        {},
        session?.data?.token
      )
        .then((res: any) => {
          onDeleted();
        })
        .catch((err: any) => {});
    }
  };

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="flex items-center border-2 w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] border-slate-800">
        <div className="flex-col p-3 w-24">
          <IoLibrary size={64} className="text-slate-800" />
        </div>
        <div className="flex-col pr-3 w-full">
          <Skeleton className="rounded-lg">
            <div className="inline-block align-middle h-full"></div>
          </Skeleton>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center border-2 w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] border-slate-800">
        <div className="flex-col p-3 w-24">
          <BiSolidMessageAltError size={64} className="text-slate-500" />
        </div>
        <div className="flex-col pr-3 w-full">
          <div className="inline-block align-middle h-full">
            <span className="inline-block align-middle h-full">
              Error loading user
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center border-2 border-gwblue w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] cursor-pointer">
        <div className="flex-col p-3 w-24">
            <FaUser size={64} />
        </div>
        <div className="flex-col pr-3 w-40">
            <span className="inline-block align-middle h-full">
                <p>
                    {user.user.name !== ""
                    ? user.user.name
                    : "[unknown user]"}
                </p>
            </span>
        </div>
        {!readOnly ? (
            <div className="absolute top-15 right-10">
            {" "}
            <Tooltip
                content={"Delete " + user.user.name}
                showArrow={true}
                color="success"
                delay={1000}
            >
                <span>
                <FaTrashCan
                    className="hover:text-gwgreen hover:cursor-pointer"
                    onClick={(e) => deleteUser(e, user.id)}
                />
                </span>
            </Tooltip>
            </div>
        ) : (
            ""
        )}
        </div>

        <UserModal
            userIn={user}
            organizationId={user.organizationId}
            disclosure={disclosure}
        />
    </div>
  );
}
