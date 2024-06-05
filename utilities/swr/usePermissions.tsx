import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function usePermissions() {
  const session: any = useSession();

  const user = useSWR(
    session?.data?.user?.email
      ? [
          "GET",
          "/user/" + session?.data?.user?.email,
          session?.data?.token,
        ]
      : null,
    ([method, url, session]) =>
      frontendFetch(method, url, null, session).then((res) => res.json())
  );

  const orgs = useSWR(
    user?.data?.id
      ? ["GET", "/userOrgPerm/" + user.data?.id, session?.data?.token]
      : null,
    ([method, url, session]) =>
      frontendFetch(method, url, null, session).then((res) => res.json())
  );

  const cons = useSWR(
    user?.data?.id
      ? ["GET", "/userConPerm/" + user.data?.id, session?.data?.token]
      : null,
    ([method, url, session]) =>
      frontendFetch(method, url, null, session).then((res) => res.json())
  );

  const permissions = {
    user: user,
    organizations: orgs,
    conventions: cons,
  };

  return {
    permissions: permissions,
    isLoading: user.isLoading || orgs.isLoading || cons.isLoading,
    isError: {
      userError: user.error,
      organizationsError: orgs.error,
      conventionsError: cons.error,
    },
  };
}
