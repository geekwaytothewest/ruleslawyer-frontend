import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import Link from "next/link";
import React, { Key } from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let orgs: any = [];
  let user: any;

  if (session?.user.email) {
    const respUser = await backendFetch("GET", "/user/" + session.user.email);
    user = await respUser.json();
    const respPerm = await backendFetch("GET", "/userOrgPerm/" + user.id);
    orgs = await respPerm.json();
  }

  return (
    <div>
      {orgs.map(
        (o: {
          organizationId: Key | null | undefined;
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
          return <div key={o.organizationId}><Link href={`/dashboard/organization/${o.organizationId}`} className="hover:text-gwgreen">{o.organization.name}</Link></div>;
        }
      )}
    </div>
  );
}
