"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { SignOut } from "./auth/signout-client";
import { CircularProgress } from "@heroui/react";
import usePermissions from "@/utilities/swr/usePermissions";
import { FaBuildingFlag, FaPeopleLine, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { IoLibrary } from "react-icons/io5";
import { GiPawn } from "react-icons/gi";
import { SIDEBAR_STORAGE_KEY } from "@/utilities/constants";

export default function SideBar({
  initialCollapsed = false,
}: {
  initialCollapsed?: boolean;
}) {
  const { permissions, isLoading }: any = usePermissions();

  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const navRef = useRef<HTMLDivElement>(null);
  const hasClicked = useRef(false);

  useEffect(() => {
    if (isLoading || hasClicked.current) return;
    const firstLink = navRef.current?.querySelector("a");
    if (firstLink) {
      hasClicked.current = true;
      firstLink.click();
    }
  }, [isLoading]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      document.cookie = `${SIDEBAR_STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  };

  const containerClass = clsx("mr-10", collapsed ? "min-w-16" : "min-w-48");

  if (isLoading) {
    return (
      <div className={containerClass}>
        <div className="text-center bg-gwdarkgreen h-48 rounded-br-lg">
          <div className="flex justify-center w-full pt-10">
            <CircularProgress isIndeterminate={true} label="Loading..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={clsx("flex bg-gwgreen border-b-2 border-gwblue", collapsed ? "justify-center" : "justify-end")}>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="p-2 text-gwdarkblue hover:text-gwdarkgreen hover:cursor-pointer"
        >
          {collapsed ? <FaAnglesRight /> : <FaAnglesLeft />}
        </button>
      </div>
      <div ref={navRef}>
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link className="group"
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
                  {
                    "bg-transparent": pathname.startsWith(`/dashboard/organization`) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collection`),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname.startsWith(`/dashboard/organization`) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collection`),
                  }
                )}
              >
                <FaBuildingFlag
                  className={clsx(
                    "text-4xl mx-auto",
                    !collapsed && "mb-2",
                    {
                      "text-gwgreen group-hover:text-gwdarkgreen": pathname.startsWith(`/dashboard/organization`) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collection`),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname.startsWith(`/dashboard/organization`) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collection`),
                    }
                  )}
                />

                {!collapsed && permissions.organizations.data[0].organization.name}
              </div>
            </Link>
          )}
        {(permissions.organizations.data?.length > 1 ||
          permissions.user?.data?.superAdmin) && (
          <Link className="group" href="/dashboard/organizations">
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
              <FaBuildingFlag
                className={clsx(
                  "text-4xl mx-auto",
                  !collapsed && "mb-2",
                  {
                    "text-gwgreen group-hover:text-gwdarkgreen": pathname?.startsWith(
                      `/dashboard/organization`
                    ),
                  },
                  {
                    "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                      `/dashboard/organization`
                    ),
                  }
                )}
              />

              {!collapsed && "Organizations"}
            </div>
          </Link>
        )}
        { permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
          <Link className="group"
            href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`}
          >
            <div
              className={clsx(
                "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
              <FaPeopleLine
                  className={clsx(
                    "text-4xl mx-auto",
                    !collapsed && "mb-2",
                    {
                      "text-gwgreen group-hover:text-gwgreen": pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`
                      ),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/conventions`
                      ),
                    }
                  )}
                />

              {!collapsed && `${new Set(
                permissions.conventions.data?.map(
                  (c: { convention: { organizationId: number } }) =>
                    c.convention.organizationId
                )
              ).size > 1 ? `${permissions.organizations.data[0].organization.name} ` : ''} Conventions`}
            </div>
          </Link>
        )}
        {((permissions.conventions.data?.length > 0 &&
          new Set(
            permissions.conventions.data?.map(
              (c: { convention: { organizationId: number } }) =>
                c.convention.organizationId
            )
          ).size > 1) ||
          (permissions.conventions.data?.length > 0 &&
            permissions.organizations.data.length === 0) ||
          permissions.user?.data?.superAdmin) && (
            <Link className="group" href={`/dashboard/conventions`}>
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
                <FaPeopleLine
                  className={clsx(
                    "text-4xl mx-auto",
                    !collapsed && "mb-2",
                    {
                      "text-gwgreen group-hover:text-gwdarkgreen": pathname?.startsWith(
                        `/dashboard/convention`
                      ),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                        `/dashboard/convention`
                      ),
                    }
                  )}
                />

                {!collapsed && "All Conventions"}
              </div>
            </Link>
          )}
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link className="group"
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
                <GiPawn
                  className={clsx(
                    "text-4xl mx-auto",
                    !collapsed && "mb-2",
                    {
                      "text-gwgreen group-hover:text-gwblue": pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`
                      ),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/games`
                      ),
                    }
                  )}
                />

                {!collapsed && "Games"}
              </div>
            </Link>
          )}
        {permissions.organizations.data?.length === 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link className="group"
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}/collections`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
                <IoLibrary
                  className={clsx(
                    "text-4xl mx-auto",
                    !collapsed && "mb-2",
                    {
                      "text-gwgreen group-hover:text-gwdarkgreen": pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/collection`
                      ),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                        `/dashboard/organization/${permissions.organizations.data[0].organizationId}/collection`
                      ),
                    }
                  )}
                />

                {!collapsed && "Collections"}
              </div>
            </Link>
          )}
      </div>
      <div className="text-center pt-10 bg-gwdarkgreen h-48 rounded-br-lg ">
        <SignOut collapsed={collapsed} />
      </div>
    </div>
  );
}
