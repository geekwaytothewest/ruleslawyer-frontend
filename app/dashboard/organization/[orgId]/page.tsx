'use client'
import beFetch from "@/utilities/beFetch";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Dashboard() {
  const params = useSearchParams();

  const orgId = params.get('orgId');
  let collections: any = [];

  if (orgId) {
    collections = beFetch("GET", "/org/" + orgId + '/collections');
  }

  return (
    <div>
      {collections.map(
        (c: {
          id: React.Key | null | undefined;
          name:
            | string
            | number
            | bigint
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Promise<React.AwaitedReactNode>
            | null
            | undefined;
        }) => {
          return <div key={c.id}>{c.name}</div>;
        }
      )}
    </div>
  );
}
