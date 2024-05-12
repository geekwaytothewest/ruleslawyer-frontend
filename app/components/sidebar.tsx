import { auth } from "../../auth";
import React from "react";
import beFetch from "@/utilities/beFetch";
import Link from "next/link";

export default async function SideBar() {
  const session = (await auth()) as any;

  let user: any = [];
  let orgCount: any = [];
  let conCount: any = [];

  if (session?.user.email) {
    user = await beFetch('GET', '/user/' + session?.user.email);

    if (user.id) {
        orgCount = await beFetch('GET', '/userOrgPerm/' + user.id + '/count');
        conCount = await beFetch('GET', '/userConPerm/' + user.id + '/count');
    }
  }

  return (
    <div className="w-1/6">
      {(orgCount > 0 || user.superAdmin) && <Link href='/dashboard/organizations'><div className="border-2 border-gwblue bg-gwgreen hover:bg-gwblue"><h1>Organizations</h1></div></Link>}
      {(conCount > 0 || user.superAdmin) && <Link href='/dashboard/conventions'><div className="border-2 border-gwblue bg-gwgreen hover:bg-gwblue"><h1>Conventions</h1></div></Link>}
      <Link href='/dashboard/games'><div className="border-2 border-gwblue bg-gwgreen hover:bg-gwblue"><h1>Games</h1></div></Link>
    </div>
  );
}
