export default function feFetch(method: string, url: string, body?: any, session?: any) {
  if (!session?.data?.token) return Promise.reject("No token in session");

  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.data.token}`,
    },
    body: body,
  });
}
