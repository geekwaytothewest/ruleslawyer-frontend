import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import Link from "next/link";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let orgs: any = [];

  if (session?.user.email) {
    orgs = await backendFetch("GET", "/userOrgPerm/" + session.user.email);
  }

  return (
    <div>
      {orgs.map(
        (o: {
          organization: {
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
        }) => {
          return <div key={o.organization.id}><Link href={`/dashboard/organization/${o.organization.id}`} className="hover:text-gwgreen">{o.organization.name}</Link></div>;
        }
      )}
    </div>
  );
}
