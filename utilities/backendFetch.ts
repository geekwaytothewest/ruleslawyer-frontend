import { auth0 } from "@/lib/auth0";

export default async function backendFetch(method: string, url: string, body?: any) {
  const { token } = await auth0.getAccessToken();

  return fetch(process.env.API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });
}
