"use client";
import CollectionGrid from "@/components/collection/collection-grid";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import { CollectionWithCount, Organization } from "@/types/models";
import React, { useEffect, useState, use } from "react";

type Params = Promise<{ orgId: string }>

export default function OrgCollectionsView(props: { params: Params }) {
  const params = use(props.params);
  const [collections, setData] = useState<CollectionWithCount[] | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setLoading] = useState(true);

  const session = useAuth();

  useEffect(() => {
    frontendFetch("GET", "/org/" + params.orgId, null, session?.data?.token)
      .then((res) => res.json())
      .then((data) => {
        setOrganization(data);
        setLoading(false);
      })
      .catch(() => {});

    frontendFetch("GET", "/org/" + params.orgId + "/collections", null, session?.data?.token)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {});
  }, [params.orgId, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!collections) return <p>No collection data</p>;

  return (
    <CollectionGrid
      collectionsIn={collections}
      organizationId={Number(params.orgId)}
    />
  );
}
