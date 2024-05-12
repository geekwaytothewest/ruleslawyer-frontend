"use client";
import React, { useEffect, useState } from "react";
import feFetch from "@/utilities/feFetch";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { SignOut } from "./signout-client";

export default function SideBar() {
  const [user, setUser]: any = useState(null);
  const [orgCount, setOrgCount]: any = useState(null);
  const [conCount, setConCount]: any = useState(null);
  const [isLoadingOrgCount, setLoadingOrgCount]: any = useState(true);
  const [isLoadingConCount, setLoadingConCount]: any = useState(true);

  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {}, [session]);

  useEffect(() => {
    feFetch("GET", "/user/" + session?.data?.user?.email, null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setUser(data);
      })
      .catch((err: any) => {});
  }, [session]);

  useEffect(() => {
    feFetch("GET", "/userOrgPerm/" + user?.id + "/count", null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setOrgCount(data);
        setLoadingOrgCount(false);
      })
      .catch((err: any) => {});
  }, [user?.id, session]);

  useEffect(() => {
    feFetch("GET", "/userConPerm/" + user?.id + "/count", null, session)
      .then((res: any) => res.json())
      .then((data: any) => {
        setConCount(data);
        setLoadingConCount(false);
      })
      .catch((err: any) => {});
  }, [user?.id, session]);

  if (isLoadingOrgCount || isLoadingConCount)
    return <div className="mr-10">Loading...</div>;

  return (
    <div className="min-w-48 mr-10">
      <div>
        {(orgCount > 0 || user.superAdmin) && (
          <Link href="/dashboard/organizations">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                { "bg-transparent": pathname.startsWith("/dashboard/organization") },
                { "bg-gwgreen border-right-2": !pathname.startsWith("/dashboard/organization") }
              )}
            >
              <h1>Organizations</h1>
            </div>
          </Link>
        )}
        {(conCount > 0 || user.superAdmin) && (
          <Link href="/dashboard/conventions">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
                { "bg-transparent": pathname.startsWith("/dashboard/conventions") },
                { "bg-gwgreen border-right-2": !pathname.startsWith("/dashboard/conventions") }
              )}
            >
              <h1>Conventions</h1>
            </div>
          </Link>
        )}
        <Link href="/dashboard/games">
          <div
            className={clsx(
              "text-center border-b-2 border-gwblue hover:bg-gwblue p-2",
              { "bg-transparent border-right-0": pathname.startsWith("/dashboard/games") },
              { "bg-gwgreen border-right-2": !pathname.startsWith("/dashboard/games") }
            )}
          >
            <h1>Games</h1>
          </div>
        </Link>
      </div>
      <div className="text-center pt-10 bg-gwdarkgreen h-full"><SignOut /></div>
    </div>
  );
}
