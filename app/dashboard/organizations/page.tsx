import { auth } from "@/auth";
import beFetch from "@/utilities/beFetch";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let orgs: any = [];

  if (session?.user.email) {
    orgs = await beFetch("GET", "/userOrgPerm/" + session.user.email);
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
          return <div key={o.organization.id}>{o.organization.name}</div>;
        }
      )}
    </div>
  );
}
