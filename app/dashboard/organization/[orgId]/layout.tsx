"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import feFetch from "@/utilities/feFetch";
import Link from "next/link";

export default function CollectionLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { orgId: string };
}>) {
  const [organization, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    feFetch("GET", "/org/" + params.orgId, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.orgId, session]);

  if (isLoading) return <p>Loading...</p>;
  if (!organization) return <p>No organization data</p>;

  return (
    <div>
      <div>
        <Link href={`/dashboard/organization/${organization.id}`} className="mr-5 after:content-[' -&gt; ''] hover:text-gwgreen">{organization.name}</Link>
        <Link href={`/dashboard/organization/${organization.id}/collections`} className="hover:text-gwgreen">Collections</Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
