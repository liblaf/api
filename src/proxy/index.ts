import { OpenAPIHono } from "@hono/zod-openapi";

export const appProxy = new OpenAPIHono();

appProxy.all("/:url{.+$}", async (c) => {
  let url: string = c.req.param("url");
  if (!(url.startsWith("http://") || url.startsWith("https://"))) {
    url = `https://${url}`;
  }
  const origin: Response = await fetch(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
    redirect: "follow",
  });
  const response = new Response(origin.body, origin);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
});
