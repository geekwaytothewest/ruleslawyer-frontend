export default function frontendFetch(
  method: string,
  url: string,
  body?: unknown,
  session?: string,
  signal?: AbortSignal,
  multiPart?: boolean
) {
  if (!session) return Promise.reject("No token in session");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session}`,
  };

  let payload: BodyInit | null = null;

  if (multiPart) {
    // Caller passes a FormData (or other BodyInit) and sets its own headers.
    payload = body as BodyInit;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
    method: method,
    headers: headers,
    body: payload,
    signal: signal,
    next: { revalidate: 60 },
  });
}
