"use client";
import CollectionCard from "@/components/collection/collection-card";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function OrgCollectionsView({
  params,
}: {
  params: { orgId: string };
}) {
  const [collections, setData]: any = useState(null);
  const [organization, setOrganization]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    frontendFetch("GET", "/org/" + params.orgId, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setOrganization(data);
        setLoading(false);
      })
      .catch((err: any) => {});

    frontendFetch("GET", "/org/" + params.orgId + "/collections", null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.orgId, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!collections) return <p>No collection data</p>;

  return (
    <div className="flex flex-wrap">
      {collections.map(
        (c: { id: React.Key | null | undefined; name: string | null }) => {
          return <CollectionCard key={c.id} collectionIn={c} />;
        }
      )}
    </div>
  );
}
