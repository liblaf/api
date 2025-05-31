import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";
import { version } from "../package.json";
import { Scalar } from "@scalar/hono-api-reference";
import { UAParser } from "ua-parser-js";
import { createApp } from "./utils";

const app: OpenAPIHono<{ Bindings: CloudflareBindings }> = createApp();

app.doc("/openapi.json", {
  info: {
    title: "liblaf's API",
    version: version,
  },
  openapi: "3.0.0",
});

app.get("/reference", Scalar({ url: "/openapi.json" }));

app.openapi(
  createRoute({
    path: "/",
    method: "get",
    responses: {
      204: { description: "No Content" },
      302: { description: "Found" },
    },
  }),
  async (c) => {
    const ua = UAParser(c.req.header("User-Agent"));
    if (ua.browser.name) return c.redirect("/reference");
    return c.newResponse(null, 204);
  },
);

export default app;
