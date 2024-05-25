import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import Link from "next/link";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let cons: any = [];

  if (session?.user.email) {
    const resp = await backendFetch("GET", "/userConPerm/" + session.user.email);
    cons = await resp.json();
  }

  return (
    <div>
      {cons.map(
        (c: {
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
        }) => {
          return <div key={c.convention.id}><Link href={`/dashboard/convention/${c.convention.id}`}>{c.convention.name}</Link></div>;
        }
      )}
    </div>
  );
}
