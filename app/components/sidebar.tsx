import { auth } from "../../auth";
import React from "react";
import beFetch from "@/utilities/beFetch";

export default async function SideBar() {
  const session = (await auth()) as any;

  let user: any = [];
  let orgPerms: any = [];
  let conPerms: any = [];

  if (session?.user.email) {
    user = await beFetch('GET', '/user/' + session?.user.email);

    if (user.id) {
        orgPerms = await beFetch('GET', '/userOrgPerm/' + user.id);
        conPerms = await beFetch('GET', '/userConPerm/' + user.id);
    }
  }

  return (
    <div className="w-300p b-1">
      <h1>Organizations</h1>
      <ul>
        {orgPerms.map((org: any) => (
          <li key={org.id}>{org.organization.name}</li>
        ))}
      </ul>
      <h1>Conventions</h1>
      <ul>
        {conPerms.map((con: any) => (
          <li key={con.id}>{con.convention.name}</li>
        ))}
      </ul>
    </div>
  );
}
