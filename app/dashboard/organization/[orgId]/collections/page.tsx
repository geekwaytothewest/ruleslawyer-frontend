"use client";
import feFetch from "@/utilities/feFetch";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function OrgCollectionsView({
  params,
}: {
  params: { orgId: string };
}) {
  const [collections, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    feFetch("GET", "/org/" + params.orgId + '/collections', null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.orgId, session]);

  if (isLoading) return <p>Loading...</p>;
  if (!collections) return <p>No collection data</p>;

  return (
    <div>
      {collections.map(
        (c: { id: React.Key | null | undefined; name: string | null }) => {
          return (
            <div key={c.id}>
              <Link
                href={`/dashboard/organization/${params.orgId}/collection/${c.id}`}
              >
                {c.name}
              </Link>
            </div>
          );
        }
      )}
    </div>
  );
}
