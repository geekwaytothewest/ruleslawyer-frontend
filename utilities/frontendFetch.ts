export default function frontendFetch(
  method: string,
  url: string,
  body?: any,
  session?: any,
  signal?: AbortSignal
) {
  if (!session) return Promise.reject("No token in session");

  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session}`,
    },
    body: body ? JSON.stringify(body) : null,
    signal: signal,
    next: {revalidate: 60}
  });
}
