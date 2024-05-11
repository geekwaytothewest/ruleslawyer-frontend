import { auth } from "@/auth";

export default async function beFetch(method: string, url: string, body?: any) {
  const session = (await auth()) as any;

  let resp = await fetch(process.env.API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    body: body,
  });

  return resp.json();
}
