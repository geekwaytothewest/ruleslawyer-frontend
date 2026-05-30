import ConventionList from "@/components/convention/convention-list";
import backendFetch from "@/utilities/backendFetch";
import { Convention } from "@/types/models";
import React from "react";

type Params = Promise<{ orgId: string }>;

export default async function OrgConventionsView(props: { params: Params }) {
  const params = await props.params;
  let cons: Convention[] = [];

  const resp = await backendFetch(
    "GET",
    "/org/" + params.orgId + "/conventions"
  );
  cons = await resp.json();

  return (
    <div>
      <ConventionList
        conventionsIn={cons}
        organizationId={Number(params.orgId)}
      />
    </div>
  );
}
