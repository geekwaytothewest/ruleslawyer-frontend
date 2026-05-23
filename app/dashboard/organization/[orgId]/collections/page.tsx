"use client";
import CollectionCard from "@/components/collection/collection-card";
import CollectionGrid from "@/components/collection/collection-grid";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import React, { useEffect, useState, use } from "react";

type Params = Promise<{ orgId: string }>

export default function OrgCollectionsView(props: { params: Params }) {
  const params = use(props.params);
  const [collections, setData]: any = useState(null);
  const [organization, setOrganization]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useAuth();

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
    <CollectionGrid collectionsIn={collections} organizationId={params.orgId} />
  );
}
