import ConventionList from "@/app/components/convention/convention-list";
import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
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
      <ConventionList conventions={cons} organizationId={params.orgId} />
    </div>
  );
}
