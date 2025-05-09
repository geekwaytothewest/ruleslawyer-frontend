import ConventionList from "@/components/convention/convention-list";
import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import React from "react";

type Params = Promise<{ orgId: string }>;

export default async function OrgConventionsView(props: { params: Params }) {
  const params = await props.params;
  const session = (await auth()) as any;
  let cons: any = [];

  const resp = await backendFetch(
    "GET",
    "/org/" + params.orgId + "/conventions"
  );
  cons = await resp.json();

  return (
    <div>
      <ConventionList conventionsIn={cons} organizationId={params.orgId} />
    </div>
  );
}
