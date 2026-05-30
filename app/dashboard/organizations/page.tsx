import { auth0 } from "@/lib/auth0";
import backendFetch from "@/utilities/backendFetch";
import { OrganizationPermissionWithOrg, User } from "@/types/models";
import Link from "next/link";
import React from "react";

export default async function Dashboard() {
  const session = await auth0.getSession();
  let orgs: OrganizationPermissionWithOrg[] = [];
  let user: User | undefined;

  if (session?.user.email) {
    const respUser = await backendFetch("GET", "/user/" + session.user.email);
    user = await respUser.json();
    const respPerm = await backendFetch("GET", "/userOrgPerm/" + user?.id);
    orgs = await respPerm.json();
  }

  return (
    <div>
      {orgs.map((o) => {
        return <div key={String(o.organizationId)}><Link href={`/dashboard/organization/${String(o.organizationId)}`} className="hover:text-gwgreen">{o.organization.name}</Link></div>;
      })}
    </div>
  );
}
