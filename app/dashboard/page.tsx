import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
  const session = (await auth()) as any;

  return <div></div>;
}
