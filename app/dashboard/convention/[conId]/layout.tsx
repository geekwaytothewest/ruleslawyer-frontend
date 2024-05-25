"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import frontendFetch from "@/utilities/frontendFetch";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useParams, usePathname } from "next/navigation";

export default function CollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [convention, setData]: any = useState(null);
  const [collection, setCollection]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);

  const session = useSession();
  const pathname = usePathname();
  const params = useParams();

  useEffect(() => {}, [session]);

  useEffect(() => {
    if (params) {
      frontendFetch("GET", "/con/" + params.conId, null, session)
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [params, session]);

  useEffect(() => {
    if (params.colId) {
      frontendFetch(
        "GET",
        "/collection/" + params.colId,
        null,
        session
      )
        .then((res: any) => res.json())
        .then((data: any) => {
          setCollection(data);
          setLoading(false);
        })
        .catch((err: any) => {});
    }
  }, [params, session]);

  if (isLoading) return <p>Loading...</p>;
  if (!convention) return <p>No convention data</p>;

  return (
    <div>
      <div>
        <Breadcrumbs size="lg" color="success" underline="hover">
          {params.conId !== null && params.conId !== undefined ? (
            <BreadcrumbItem href={`/dashboard/convention/${convention.id}`}>
              {convention.name}
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {pathname.includes("collection") ? (
            <BreadcrumbItem
              href={`/dashboard/convention/${convention.id}/collections`}
            >
              Collections
            </BreadcrumbItem>
          ) : (
            ""
          )}

          {params.colId !== null && params.colId !== undefined ? (
            <BreadcrumbItem
              href={`/dashboard/organization/${convention.id}/collection/${params.colId}`}
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
