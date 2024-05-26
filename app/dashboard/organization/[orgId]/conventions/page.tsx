import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import Link from "next/link";
import React from "react";

export default async function OrgConventionsView({
  params,
}: {
  params: { orgId: string };
}) {
  const session = (await auth()) as any;
  let cons: any = [];

  const resp = await backendFetch(
    "GET",
    "/org/" + params.orgId + "/conventions"
  );
  cons = await resp.json();

  return (
    <div>
      {cons.map(
        (c: {
          name: string;
          convention: {
            id: React.Key | null | undefined;
            name:
              | string
              | number
              | bigint
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | Promise<React.AwaitedReactNode>
              | null
              | undefined;
          };
          id: any;
        }) => {
          return (
            <div key={c.id}>
              <Link href={`/dashboard/organization/${params.orgId}/convention/${c.id}`}>
                {c.name}
              </Link>
            </div>
          );
        }
      )}
    </div>
  );
}
