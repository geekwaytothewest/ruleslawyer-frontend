"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { Skeleton } from "@nextui-org/react";
import { BiSolidMessageAltError } from "react-icons/bi";
import { IoLibrary } from "react-icons/io5";
import { GrDetach } from "react-icons/gr";

export default function CollectionCard(props: any) {
  let { collectionIn, conventionId, onDeleted } = props;

  const [collection, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (collectionIn) {
      setData(collectionIn);
      setLoading(false);
    } else {
      frontendFetch("GET", "/collection/" + collectionIn.id, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [collectionIn, session]);

  const detachCollection = (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    collectionId: number
  ) => {
    frontendFetch(
      "DELETE",
      "/con/" + conventionId + "/conventionCollection/" + collectionId,
      {},
      session
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        onDeleted();
      })
      .catch((err: any) => {});
  };

  if (isLoading) {
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
        {conventionId ? (
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
