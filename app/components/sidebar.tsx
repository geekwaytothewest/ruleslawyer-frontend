"use client";
import React, { useEffect, useState } from "react";
import frontendFetch from "@/utilities/frontendFetch";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignOut } from "./auth/signout-client";
import { CircularProgress } from "@nextui-org/react";

export default function SideBar() {
  const [user, setUser]: any = useState(null);
  const [orgs, setOrgs]: any = useState(null);
  const [cons, setCons]: any = useState(null);
  const [isLoadingOrgCount, setLoadingOrgCount]: any = useState(true);
  const [isLoadingConCount, setLoadingConCount]: any = useState(true);
  const [isLoadingUser, setLoadingUser]: any = useState(true);

  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    frontendFetch("GET", "/user/" + session?.data?.user?.email, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setUser(data);
        setLoadingUser(false);
      })
      .catch((err: any) => {});
  }, [session]);

  useEffect(() => {
    if (user) {
      frontendFetch("GET", "/userOrgPerm/" + user.id, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          localStorage.setItem("userOrgPerm", data);
          setOrgs(data);
          setLoadingOrgCount(false);
        })
        .catch((err: any) => {});
    }
  }, [user, session]);

  useEffect(() => {
    if (user) {
      frontendFetch("GET", "/userConPerm/" + user.id, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          localStorage.setItem("userConPerm", data);
          setCons(data);
          setLoadingConCount(false);
        })
        .catch((err: any) => {});
    }
  }, [user, session]);

  if (isLoadingOrgCount | isLoadingConCount | isLoadingUser) {
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
        {orgs.length === 1 && !user?.superAdmin && (
          <Link href={`/dashboard/organization/${orgs[0].organization.id}`}>
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
              <h1>{orgs[0].organization.name}</h1>
            </div>
          </Link>
        )}
        {(orgs.length > 1 || user?.superAdmin) && (
          <Link href="/dashboard/organizations">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent": pathname.startsWith(
                    "/dashboard/organizations"
                  ),
                },
                {
                  "bg-gwgreen border-right-2": !pathname.startsWith(
                    "/dashboard/organizations"
                  ),
                }
              )}
            >
              <h1>Organizations</h1>
            </div>
          </Link>
        )}
        {cons.length == 1 && !user?.superAdmin && (
          <Link href={`/dashboard/convention/${cons[0].convention.id}`}>
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
              <h1>{cons[0].convention.name}</h1>
            </div>
          </Link>
        )}
        {(cons.length > 1 || user?.superAdmin) && (
          <Link href="/dashboard/conventions">
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
              <h1>Conventions</h1>
            </div>
          </Link>
        )}
        {orgs.length === 1 && !user?.superAdmin && (
          <Link href="/dashboard/games">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                {
                  "bg-transparent border-right-0":
                    pathname.startsWith("/dashboard/games"),
                },
                {
                  "bg-gwgreen border-right-2":
                    !pathname.startsWith("/dashboard/games"),
                }
              )}
            >
              <h1>Games</h1>
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
