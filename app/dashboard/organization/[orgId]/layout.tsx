"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { useParams, usePathname } from "next/navigation";

export default function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [organization, setData]: any = useState(null);
  const [collection, setCollection]: any = useState(null);
  const [convention, setConvention]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useSession();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {
    if (params) {
      frontendFetch("GET", "/org/" + params.orgId, null, session?.data?.token)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [params, session?.data?.token]);

  useEffect(() => {
    if (params?.colId) {
      frontendFetch(
        "GET",
        "/collection/" + params.colId,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollection(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [params, session?.data?.token]);

  useEffect(() => {
    if (params?.conId) {
      frontendFetch(
        "GET",
        "/con/" + params.conId,
        null,
        session?.data?.token
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setConvention(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [params, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!organization) return <p>No organization data</p>;

  return (
    <div>
      <div className="mb-5">
        <Breadcrumbs size="lg" color="success" underline="hover">
          {params?.orgId !== null && params?.orgId !== undefined ? (
            <BreadcrumbItem href={`/dashboard/organization/${organization.id}`}>
              {organization.name}
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {pathname?.includes("convention") ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${organization.id}/conventions`}
            >
              Conventions
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {params?.conId !== null && params?.conId !== undefined ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${organization.id}/convention/${convention?.id}`}
            >
              {convention?.name}
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {pathname?.includes("collection") ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${organization.id}/collections`}
            >
              Collections
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {params?.colId !== null && params?.colId !== undefined ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${organization.id}/collection/${params.colId}`}
            >
              {collection?.name}
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {pathname?.includes("games") ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${organization.id}/games`}
            >
              Games
            </BreadcrumbItem>
          ) : (
            ""
          )}
        </Breadcrumbs>
      </div>
      <div>{children}</div>
    </div>
  );
}
