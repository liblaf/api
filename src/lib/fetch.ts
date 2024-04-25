import { HTTPException } from "hono/http-exception";

export async function fetchSafe(
  input: RequestInfo,
  init?: RequestInit<RequestInitCfProperties>,
): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    console.log(response.headers);
    const headers = new Headers(response.headers);
    headers.set("X-Error-Url", response.url);
    const res = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
    throw new HTTPException(undefined, { res: res });
  }
  return response;
}
