"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/utilities/swr/useAuth";
import frontendFetch from "@/utilities/frontendFetch";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { useParams, usePathname } from "next/navigation";

export default function ConventionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [convention, setData]: any = useState(null);
  const [collection, setCollection]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session: any = useAuth();
  const pathname = usePathname();
  const params = useParams();

  const conId = params?.conId;
  const colId = params?.colId;
  const token = session?.data?.token;

  useEffect(() => {
    if (!conId || !token) return;
    frontendFetch("GET", "/con/" + conId, null, token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {});
  }, [conId, token]);

  useEffect(() => {
    if (!colId || !token) return;
    frontendFetch("GET", "/collection/" + colId, null, token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setCollection(data);
        setLoading(false);
      })
      .catch(() => {});
  }, [colId, token]);

  if (isLoading) return <p>Loading...</p>;
  if (!convention) return <p>No convention data</p>;

  return (
    <div>
      <div className="mb-5">
        <Breadcrumbs size="lg" color="success" underline="hover">
          {params?.conId !== null && params?.conId !== undefined ? (
            <BreadcrumbItem href={`/dashboard/convention/${convention.id}`}>
              {convention.name}
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {pathname?.includes("collection") ? (
            <BreadcrumbItem
              href={`/dashboard/convention/${convention.id}/collections`}
            >
              Collections
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {params?.colId !== null && params?.colId !== undefined ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${convention.id}/collection/${params?.colId}`}
            >
              {collection?.name}
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
