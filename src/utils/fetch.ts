import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";

export async function fetchUnsafe(
  input: RequestInfo,
  init?: RequestInit<RequestInitCfProperties>,
): Promise<Response> {
  const resp: Response = await fetch(input, { redirect: "follow", ...init });
  if (!resp.ok) {
    console.error({ input, init, resp });
    const res: Response = new Response(resp.body, resp);
    res.headers.set("X-Error-Url", `${input}`);
    throw new HTTPException(resp.status as StatusCode, { res: res });
  }
  return resp;
}
