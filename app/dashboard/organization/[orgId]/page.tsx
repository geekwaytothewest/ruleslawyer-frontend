"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState, use } from "react";

type Params = Promise<{ orgId: string }>;

export default function OrgView(props: { params: Params }) {
  const params = use(props.params);

  const [organization, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useSession();

  useEffect(() => {
    frontendFetch("GET", "/org/" + params.orgId, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.orgId, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!organization) return <p>No organization data</p>;

  return (
    <div>
      <div>
        <Link
          href={`/dashboard/organization/${params.orgId}/conventions`}
          className="hover:text-gwgreen"
        >
          Conventions
        </Link>
      </div>
      <div>
        <Link
          href={`/dashboard/organization/${params.orgId}/games`}
          className="hover:text-gwgreen"
        >
          Games
        </Link>
      </div>
      <div>
        <Link
          href={`/dashboard/organization/${params.orgId}/collections`}
          className="hover:text-gwgreen"
        >
          Collections
        </Link>
      </div>
    </div>
  );
}
