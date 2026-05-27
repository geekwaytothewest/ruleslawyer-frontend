"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { SignOut } from "./auth/signout-client";
import { CircularProgress } from "@heroui/react";
import usePermissions from "@/utilities/swr/usePermissions";
import { FaBuildingFlag, FaPeopleLine } from "react-icons/fa6";
import { IoLibrary } from "react-icons/io5";
import { GiPawn } from "react-icons/gi";

export default function SideBar() {
  const { permissions, isLoading }: any = usePermissions();

  const pathname = usePathname();

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
            <Link className="group"
              href={`/dashboard/organization/${permissions.organizations.data[0].organizationId}`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
                  {
                    "bg-transparent": pathname.startsWith(`/dashboard/organization`) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collections`),
                  },
                  {
                    "bg-gwgreen border-right-2": !pathname.startsWith(`/dashboard/organization`) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collections`),
                  }
                )}
              >
                <FaBuildingFlag
                  className={clsx(
                    "text-4xl mx-auto mb-2",
                    {
                      "text-gwgreen group-hover:text-gwdarkgreen": pathname.startsWith(`/dashboard/organization`) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collections`),
                    },
                    {
                      "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname.startsWith(`/dashboard/organization`) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collections`),
                    }
                  )}
                />

                {permissions.organizations.data[0].organization.name}
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
                  ) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collections`),
                },
                {
                  "bg-gwgreen border-right-2": !pathname?.startsWith(
                    "/dashboard/organization"
                  ) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collections`),
                }
              )}
            >
              <FaBuildingFlag
                className={clsx(
                  "text-4xl mx-auto mb-2",
                  {
                    "text-gwblue group-hover:text-gwgreen": pathname?.startsWith(
                      `/dashboard/organization`
                    ) && !pathname.includes(`/conventions`) && !pathname.includes(`/games`) && !pathname.includes(`/collections`),
                  },
                  {
                    "text-gwdarkblue group-hover:text-gwdarkgreen": !pathname?.startsWith(
                      `/dashboard/organization`
                    ) || pathname.includes(`/conventions`) || pathname.includes(`/games`) || pathname.includes(`/collections`),
                  }
                )}
              />

              Organizations
            </div>
          </Link>
        )}
        {permissions.conventions.data?.length == 1 &&
          !permissions.user?.data?.superAdmin && (
            <Link className="group"
              href={`/dashboard/convention/${permissions.conventions.data[0].convention.id}`}
            >
              <div
                className={clsx(
                  "text-center border-b-2 border-gwblue group-hover:bg-gwblue p-2",
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
              <FaPeopleLine
                  className={clsx(
                    "text-4xl mx-auto mb-2",
                    {
                      "text-gwgreen group-hover:text-gwblue": pathname?.startsWith(
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

                <h1>{permissions.conventions.data[0].convention.name}</h1>
              </div>
            </Link>
          )}
        {((permissions.conventions.data?.length > 1 &&
          permissions.organizations.data?.length == 1) ||
          permissions.user?.data?.superAdmin) && (
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
                    "text-4xl mx-auto mb-2",
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

              Conventions
            </div>
          </Link>
        )}
        {permissions.conventions.data?.length > 1 &&
          permissions.organizations.data?.length !== 1 && (
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
                    "text-4xl mx-auto mb-2",
                    {
                      "text-gwgreen group-hover:text-gwblue": pathname?.startsWith(
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

                Conventions
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
                    "text-4xl mx-auto mb-2",
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

                Games
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
                    "text-4xl mx-auto mb-2",
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
