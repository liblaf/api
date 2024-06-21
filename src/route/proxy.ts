import { newApp } from "@lib/bindings";
import { fetchSafe } from "@lib/fetch";

export const appProxy = newApp();

appProxy.all("/:url{.+}", async (c) => {
  let url = c.req.param("url");
  if (!url.match(/^https?:\/\//)) url = `https://${url}`;
  const origin = await fetchSafe(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
    redirect: "follow",
  });
  return new Response(origin.body, origin);
});
