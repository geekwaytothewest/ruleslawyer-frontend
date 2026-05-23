import ConventionList from "@/components/convention/convention-list";
import { auth0 } from "@/lib/auth0";
import backendFetch from "@/utilities/backendFetch";
import React from "react";

export default async function Dashboard() {
  const session = await auth0.getSession();
  let cons: any = [];

  if (session?.user.email) {
    const userResp = await backendFetch('GET', '/user/' + session.user.email)
    const user = await userResp.json();

    const userConResp = await backendFetch(
      "GET",
      "/userConPerm/" + user.id
    );

    cons = await userConResp.json();
  }

  return (
    <div>
      <ConventionList
        conventions={cons.map((c: { convention: any }) => c.convention)}
      />
    </div>
  );
}
