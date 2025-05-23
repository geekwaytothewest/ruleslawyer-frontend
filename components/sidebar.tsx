"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { SignOut } from "./auth/signout-client";
import { CircularProgress } from "@heroui/react";
import usePermissions from "@/utilities/swr/usePermissions";
import { signIn, useSession } from "next-auth/react";

export default function SideBar() {
  const { permissions, isLoading, isError }: any = usePermissions();

  const pathname = usePathname();

  const { data: session } = useSession();

  useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-w-48 mr-10">
        <div className="text-center bg-gwdarkgreen h-48 rounded-br-lg">
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
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                  {
                    "bg-transparent": pathname?.startsWith(
                      "/dashboard/organization"
                    ),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname?.startsWith(
                      "/dashboard/organization"
                    ),
                  }
                )}
              >
                {permissions.organizations.data[0].organization.name}
              </div>
            </Link>
          )}
        {(permissions.organizations.data?.length > 1 ||
          permissions.user?.data?.superAdmin) && (
          <Link href="/dashboard/organizations">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname?.startsWith(
                    "/dashboard/organization"
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname?.startsWith(
                    "/dashboard/organization"
                  ),
                }
              )}
            >
              Organizations
            </div>
          </Link>
        )}
        {permissions.conventions.data?.length == 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link
              href={`/dashboard/convention/${permissions.conventions.data[0].convention.id}`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                  {
                    "bg-transparent": pathname?.startsWith(
                      "/dashboard/convention"
                    ),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname?.startsWith(
                      "/dashboard/convention"
                    ),
                  }
                )}
              >
                <h1>{permissions.conventions.data[0].convention.name}</h1>
              </div>
            </Link>
          )}
        {((permissions.conventions.data?.length > 1 &&
          permissions.organizations.data?.length == 1) ||
          permissions.user?.data?.superAdmin) && (
          <Link
            href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`}
          >
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname?.startsWith(
                    `/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname?.startsWith(
                    `/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`
                  ),
                }
              )}
            >
              Conventions
            </div>
          </Link>
        )}
        {permissions.conventions.data?.length > 1 &&
          permissions.organizations.data?.length !== 1 && (
            <Link href={`/dashboard/conventions`}>
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                  {
                    "bg-transparent": pathname?.startsWith(
                      `/dashboard/convention`
                    ),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname?.startsWith(
                      `/dashboard/convention`
                    ),
                  }
                )}
              >
                Conventions
              </div>
            </Link>
          )}
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                  {
                    "bg-transparent border-right-0": pathname?.startsWith(
                      `/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`
                    ),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname?.startsWith(
                      `/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`
                    ),
                  }
                )}
              >
                Games
              </div>
            </Link>
          )}
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/collections`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                  {
                    "bg-transparent border-right-0": pathname?.startsWith(
                      `/dashboard/organization/${permissions.organizations.data[0].organizationId}/collection`
                    ),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname?.startsWith(
                      `/dashboard/organization/${permissions.organizations.data[0].organizationId}/collection`
                    ),
                  }
                )}
              >
                Collections
              </div>
            </Link>
          )}
      </div>
      <div className="text-center pt-10 bg-gwdarkgreen h-48 rounded-br-lg ">
        <SignOut />
      </div>
    </div>
  );
}
