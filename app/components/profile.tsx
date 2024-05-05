import { auth } from "../../auth";
import React from "react";
import { SignOut } from "@/app/components/signout";
import { SignIn } from "@/app/components/signin";
import Image from "next/image";

export default async function Profile() {
  const session = (await auth()) as any;
  console.log(session);
  if (session?.token) {
    const res = await fetch(
      process.env.API_URL + "/user/" + encodeURI(session?.user.email),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const body = await res.json();

    console.log(body);
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
