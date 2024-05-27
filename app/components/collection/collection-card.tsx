"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { Skeleton } from "@nextui-org/react";
import { BiSolidMessageAltError } from "react-icons/bi";
import { IoLibrary } from "react-icons/io5";
import { GrDetach } from "react-icons/gr";
import useSWR from "swr";

export default function CollectionCard(props: any) {
  let { collectionIn, conventionId, onDeleted } = props;

  const [collection, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const [readOnly, setReadOnly]: any = useState(true);
  const [isLoadingUser, setLoadingUser]: any = useState(true);

  const session: any = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (collectionIn) {
      setData(collectionIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/collection/" + collectionIn.id, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [collectionIn, session?.data?.token]);

  const user = useSWR(session?.data?.user?.email ?
    ["GET", "/user/" + session?.data?.user?.email, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const userOrgPerm = useSWR(user?.data?.id ?
    ["GET", "/userOrgPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const userConPerm = useSWR(user?.data?.id ?
    ["GET", "/userConPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  useEffect(() => {
    if (user && collection) {
      if (
        userOrgPerm.data?.filter(
          (d: { organizationId: any; admin: boolean }) =>
            d.organizationId === collection.organizationId && d.admin === true
        ).length > 0
      ) {
        setReadOnly(false);
      } else {
        if (
          userConPerm.data?.filter(
            (d: { conventionId: any; admin: boolean }) =>
              collection.conventions?.filter(
                (c: { conventionId: any }) => d.conventionId === c.conventionId
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
  }, [user, userConPerm, userOrgPerm, collection]);

  const detachCollection = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    collectionId: number
  ) => {
    if (confirm("Are you sure you want to detach this collection?")) {
      frontendFetch(
        "DELETE",
        "/con/" + conventionId + "/conventionCollection/" + collectionId,
        {},
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          onDeleted();
        })
        .catch((err: any) => {});
    }
  };

  if (isLoading ) {
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

  if (!collection) {
    return (
      <div className="flex items-center border-2 w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] border-slate-800">
        <div className="flex-col p-3 w-24">
          <BiSolidMessageAltError size={64} className="text-slate-500" />
        </div>
        <div className="flex-col pr-3 w-full">
          <div className="inline-block align-middle h-full">
            <span className="inline-block align-middle h-full">
              Error loading collection
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center border-2 border-gwblue w-80 h-32 mr-5 mb-5 bg-gwdarkblue hover:bg-gwgreen/[.50] cursor-pointer">
        <div className="flex-col p-3 w-24">
          <IoLibrary size={64} />
        </div>
        <div className="flex-col pr-3 w-full">
          <span className="inline-block align-middle h-full">
            <h1>
              {collection.name !== ""
                ? collection.name
                : "[unknown collection]"}
            </h1>
            <h2>Copies: {collection._count.copies}</h2>
          </span>
        </div>
        {conventionId && !readOnly ? (
          <div className="absolute bottom-5 right-10">
            <GrDetach
              className="hover:text-gwlightblue"
              onClick={(e) => detachCollection(e, collection.id)}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
