import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import { PermissionsResponse } from "@/types/models";
import useSWR from "swr";

export default function usePermissions() {
  const session = useAuth();

  const combined = useSWR<PermissionsResponse>(
    session?.data?.user?.email && session?.data?.token
      ? [
          "GET",
          "/permissions/" + session?.data?.user?.email,
          session?.data?.token,
        ]
      : null,
    ([method, url, token]: [string, string, string]) =>
      frontendFetch(method, url, null, token).then((res) => res.json())
  );

  const permissions = {
    user: { data: combined.data?.user },
    organizations: { data: combined.data?.organizations ?? [] },
    conventions: { data: combined.data?.conventions ?? [] },
  };

  return {
    permissions: permissions,
    isLoading: combined.isLoading,
    isError: {
      userError: combined.error,
      organizationsError: combined.error,
      conventionsError: combined.error,
    },
  };
}
