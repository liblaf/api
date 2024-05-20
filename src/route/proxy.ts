import { OpenAPIHono } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";

export const appProxy = new OpenAPIHono();

appProxy.all("/:url{.+}", async (c) => {
  let url = c.req.param("url");
  if (!url.match(/^https?:\/\//)) url = "https://" + url;
  const origin = await fetchSafe(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
    redirect: "follow",
  });
  return new Response(origin.body, origin);
});
