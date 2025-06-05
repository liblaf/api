import { createRoute } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { UAParser } from "ua-parser-js";
import { description, version } from "../package.json";
import { icons, mihomo, rules } from "./routes";
import { type App, createApp } from "./utils";
import { HTTPException } from "hono/http-exception";

const app: App = createApp();

app.onError(async (err, c): Promise<Response> => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.text(`${err}`, 500);
});

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "liblaf's API",
    description: description,
    version: version,
  },
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

icons(app);
mihomo(app);
rules(app);

export default app;
