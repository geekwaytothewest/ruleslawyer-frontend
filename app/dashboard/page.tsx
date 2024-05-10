import { auth } from "@/auth";
import React from 'react';

export default async function Dashboard() {
  const session = (await auth()) as any;
  let orgResp = await fetch(process.env.API_URL + "/org/1/conventions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });

const body = await orgResp.json();

return (
  <div>
    {body.map((convention: any) => (
      (
        <div key={convention.id}>
          <h1>{convention.name}</h1>
          <h2>{convention.theme}</h2>
          Hello World
        </div>
      )
    ))}
  </div>
);
}
