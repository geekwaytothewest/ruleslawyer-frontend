import { auth } from "../auth";
import React from "react";
import { SignOut } from "@/components/auth/signout-server";
import { SignIn } from "@/components/auth/signin";
import Image from "next/image";
import Link from "next/link";

export default async function Profile() {
  const session = (await auth()) as any;

  if (!session?.token) {
    return <SignIn />;
  }

  return (
    <div className="flex justify-center items-center">
      <Image
        src={session.user.image ?? ""}
        width={50}
        height={50}
        alt="Profile Picture"
      />
      <h1 className="p-5">{session.user.email}</h1>
      <Link href="/dashboard" className="p-5 hover:text-gwgreen">Dashboard</Link>
      <SignOut />
    </div>
  );
}
