import ConventionList from "@/components/convention/convention-list";
import { auth0 } from "@/lib/auth0";
import backendFetch from "@/utilities/backendFetch";
import { Convention, UserConventionPermissionsWithConvention } from "@/types/models";
import React from "react";

export default async function Dashboard() {
  const session = await auth0.getSession();
  let cons: UserConventionPermissionsWithConvention[] = [];

  if (session?.user.email) {
    const userResp = await backendFetch('GET', '/user/' + session.user.email)
    const user = await userResp.json();

    if (user?.id) {
      const userConResp = await backendFetch(
        "GET",
        "/userConPerm/" + user.id
      );

      const data = await userConResp.json();
      // Guard against error responses (e.g. a 403 JSON body), which would
      // otherwise blow up the .map() below with "cons.map is not a function".
      if (Array.isArray(data)) {
        cons = data;
      }
    }
  }

  // Drop permission rows whose convention relation is missing so we never hand
  // a null into ConventionList (which keys on convention.id).
  const conventions = cons
    .map((c) => c.convention)
    .filter((c): c is Convention => c != null);

  return (
    <div>
      <ConventionList conventionsIn={conventions} />
    </div>
  );
}
