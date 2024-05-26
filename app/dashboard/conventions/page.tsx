import ConventionList from "@/app/components/convention/convention-list";
import { auth } from "@/auth";
import backendFetch from "@/utilities/backendFetch";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;
  let cons: any = [];

  if (session?.user.email) {
    const resp = await backendFetch(
      "GET",
      "/userConPerm/" + session.user.email
    );
    cons = await resp.json();
  }

  return (
    <div>
      <ConventionList
        conventions={cons.map((c: { convention: any }) => c.convention)}
      />
    </div>
  );
}
