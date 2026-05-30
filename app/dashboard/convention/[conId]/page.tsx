"use client";
import frontendFetch from "@/utilities/frontendFetch";
import { useAuth } from "@/utilities/swr/useAuth";
import { Convention } from "@/types/models";
import React, { useEffect, useState, use } from "react";

type Params = Promise<{ conId: string }>;

export default function ConView(props: { params: Params }) {
  const [convention, setData] = useState<Convention | null>(null);
  const [isLoading, setLoading] = useState(true);
  const params = use(props.params);

  const session = useAuth();

  useEffect(() => {
    frontendFetch("GET", "/con/" + params.conId, null, session?.data?.token)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {});
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
