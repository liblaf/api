import { HTTPException } from "hono/http-exception";

export async function fetchSafe(
  input: RequestInfo,
  init?: RequestInit<RequestInitCfProperties>,
): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    console.error(`Failed to fetch: ${response.url}`);
    const res = new Response(response.body, response);
    res.headers.set("X-Error-Url", response.url);
    throw new HTTPException(response.status, { res: res });
  }
  return response;
}
