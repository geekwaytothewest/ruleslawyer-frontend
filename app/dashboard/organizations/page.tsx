import { auth0 } from "@/lib/auth0";
import backendFetch from "@/utilities/backendFetch";
import Link from "next/link";
import React, { Key } from "react";

export default async function Dashboard() {
  const session = await auth0.getSession();
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
              | null
              | undefined;
          };
        }) => {
          return <div key={String(o.organizationId)}><Link href={`/dashboard/organization/${String(o.organizationId)}`} className="hover:text-gwgreen">{o.organization.name}</Link></div>;
        }
      )}
    </div>
  );
}
