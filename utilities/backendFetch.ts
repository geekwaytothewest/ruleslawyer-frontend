import { auth } from "@/auth";

export default async function backendFetch(method: string, url: string, body?: any) {
  const session = (await auth()) as any;

  return fetch(process.env.API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
    body: body ? JSON.stringify(body) : null,
    cache: 'force-cache'
  });
}
