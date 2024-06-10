export default function frontendFetch(
  method: string,
  url: string,
  body?: any,
  session?: any,
  signal?: AbortSignal,
  multiPart?: boolean
) {
  if (!session) return Promise.reject("No token in session");

  const headers: any = {
    Authorization: `Bearer ${session}`,
  };

  if (!multiPart) {
    if (body) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    } else {
      body = null;
    }
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: method,
    headers: headers,
    body: body,
    signal: signal,
    next: { revalidate: 60 },
  });
}
