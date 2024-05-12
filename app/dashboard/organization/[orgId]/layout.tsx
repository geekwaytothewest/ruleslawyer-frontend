"use client"
import { useSearchParams } from "next/navigation";
import beFetch from "@/utilities/beFetch";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useSearchParams();

  const orgId = params.get("orgId");
  let org: any;

  if (orgId) {
    org = beFetch("GET", "/org/" + orgId);
  }

  if (org) {
    return (
      <div className="flex">
        <div key={org.id}>{org.name}</div>
        <div className="width-5/6">{children}</div>
      </div>
    );
  } else {
    <div>Organization not found or no permissions</div>;
  }
}
