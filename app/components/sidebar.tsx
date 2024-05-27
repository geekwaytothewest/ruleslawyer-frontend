"use client";
import React, { useEffect, useState } from "react";
import frontendFetch from "@/utilities/frontendFetch";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignOut } from "./auth/signout-client";
import { CircularProgress } from "@nextui-org/react";
import useSWR from "swr";

export default function SideBar() {
  const [isLoadingOrgCount, setLoadingOrgCount]: any = useState(true);
  const [isLoadingConCount, setLoadingConCount]: any = useState(true);
  const [isLoadingUser, setLoadingUser]: any = useState(true);

  const pathname = usePathname();
  const session: any = useSession();

  useEffect(() => {}, [session]);

  const user = useSWR(session?.data?.user?.email ?
    ["GET", "/user/" + session?.data?.user?.email, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const orgs = useSWR(user?.data?.id ?
    ["GET", "/userOrgPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  const cons = useSWR(user?.data?.id ?
    ["GET", "/userConPerm/" + user.data?.id, null, session?.data?.token] : null,
    ([method, url, body, session]) =>
      frontendFetch(method, url, body, session).then((res) => res.json())
  );

  if (user.isLoading || cons.isLoading || orgs.isLoading) {
    return (
      <div className="min-w-48 mr-10">
        <div className="text-center bg-gwdarkgreen h-full">
          <div className="flex justify-center w-full pt-10">
            <CircularProgress isIndeterminate={true} label="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-48 mr-10">
      <div>
        {orgs.data?.length === 1 && !user?.data?.superAdmin && (
          <Link href={`/dashboard/organization/${orgs.data[0].organizationId}`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    "/dashboard/organization"
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    "/dashboard/organization"
                  ),
                }
              )}
            >
              <h1>{orgs.data[0].organization.name}</h1>
            </div>
          </Link>
        )}
        {(orgs.data?.length > 1 || user?.data?.superAdmin) && (
          <Link href="/dashboard/organizations">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    "/dashboard/organization"
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    "/dashboard/organization"
                  ),
                }
              )}
            >
              <h1>Organizations</h1>
            </div>
          </Link>
        )}
        {cons.data?.length == 1 && !user?.data?.superAdmin && (
          <Link href={`/dashboard/convention/${cons.data[0].convention.id}`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    "/dashboard/convention"
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    "/dashboard/convention"
                  ),
                }
              )}
            >
              <h1>{cons.data[0].convention.name}</h1>
            </div>
          </Link>
        )}
        {((cons.data?.length > 1 && orgs.data?.length == 1) || user?.data?.superAdmin) && (
          <Link href={`/dashboard/organization/${orgs.data[0].organizationId}/conventions`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    `/dashboard/organization/${orgs.data[0].organizationId}/conventions`
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    `/dashboard/organization/${orgs.data[0].organizationId}/conventions`
                  ),
                }
              )}
            >
              <h1>Conventions</h1>
            </div>
          </Link>
        )}
        {(cons.data?.length > 1 && orgs.data?.length !== 1) && (
          <Link href={`/dashboard/conventions`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    `/dashboard/convention`
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    `/dashboard/convention`
                  ),
                }
              )}
            >
              <h1>Conventions</h1>
            </div>
          </Link>
        )}
        {orgs.data?.length === 1 && !user?.data?.superAdmin && (
          <Link href={`/dashboard/organization/${orgs.data[0].organizationId}/games`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent border-right-0":
                    pathname.startsWith(`/dashboard/organization/${orgs.data[0].organizationId}/games`),
                },
                {
                  "bg-gwgreen border-right-2":
                    !pathname.startsWith(`/dashboard/organization/${orgs.data[0].organizationId}/games`),
                }
              )}
            >
              <h1>Games</h1>
            </div>
          </Link>
        )}
        {orgs.data?.length === 1 && !user?.data?.superAdmin && (
          <Link href={`/dashboard/organization/${orgs.data[0].organizationId}/collections`}>
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent border-right-0":
                    pathname.startsWith(`/dashboard/organization/${orgs.data[0].organizationId}/collections`),
                },
                {
                  "bg-gwgreen border-right-2":
                    !pathname.startsWith(`/dashboard/organization/${orgs.data[0].organizationId}/collections`),
                }
              )}
            >
              <h1>Collections</h1>
            </div>
          </Link>
        )}
      </div>
      <div className="text-center pt-10 bg-gwdarkgreen h-full">
        <SignOut />
      </div>
    </div>
  );
}
