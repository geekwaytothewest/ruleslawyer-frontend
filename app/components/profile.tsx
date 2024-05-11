import { auth } from "../../auth";
import React from "react";
import { SignOut } from "@/app/components/signout";
import { SignIn } from "@/app/components/signin";
import Image from "next/image";
import beFetch from "@/utilities/beFetch";

export default async function Profile() {
  const session = (await auth()) as any;

  if (session?.token) {
    const res = await beFetch(
      'GET',
      '/user/' + encodeURI(session?.user.email),
    );

    session.user.id = res.id;
  } else {
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
      <SignOut />
    </div>
  );
}
