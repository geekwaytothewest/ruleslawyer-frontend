"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, use } from "react";

type Params = Promise<{ conId: string }>;

export default function ConView(props: { params: Params }) {
  const [convention, setData]: any = useState(null);
  const [isLoading, setLoading]: any = useState(true);
  const params = use(props.params);

  const session: any = useSession();

  useEffect(() => {
    frontendFetch("GET", "/con/" + params.conId, null, session?.data?.token)
      .then((res: any) => res.json())
      .then((data: any) => {
        setData(data);
        setLoading(false);
      })
      .catch((err: any) => {});
  }, [params.conId, session?.data?.token]);

  if (isLoading) return <p>Loading...</p>;
  if (!convention) return <p>No convention data</p>;

  return (
    <div>
      <h1>{convention.name}</h1>
      <h2>{convention.theme}</h2>
    </div>
  );
}
