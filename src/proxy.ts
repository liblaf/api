import { OpenAPIHono } from "@hono/zod-openapi";

export const appProxy = new OpenAPIHono();

appProxy.all("/:path{.+$}", async (c) => {
  let path: string = c.req.param("path");
  if (!(path.startsWith("http://") || path.startsWith("https://"))) {
    path = `https://${path}`;
  }
  const url = new URL(path);
  const responseRaw: Response = await fetch(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
    redirect: "follow",
  });
  const response = new Response(responseRaw.body, responseRaw);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
});
