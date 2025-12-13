import { Scalar } from "@scalar/hono-api-reference";
import { fromHono, type HonoOpenAPIRouterType } from "chanfana";
import { Hono } from "hono";
import { description, version } from "../package.json";
import { RouteSubscribe, registerLLMRoutes } from "./routes";

export function createApp(): Hono<{ Bindings: CloudflareBindings }> {
  const app = new Hono<{ Bindings: CloudflareBindings }>();
  const openapi: HonoOpenAPIRouterType<{ Bindings: CloudflareBindings }> =
    fromHono(app, {
      schema: {
        info: {
          title: "liblaf's API",
          description,
          version,
        },
      },
    });
  openapi.onError(async (err, c) => {
    console.error(err);
    return c.text(`${err}`, 500);
  });
  openapi.get("/", Scalar({ url: "/openapi.json" }));
  registerLLMRoutes(app, openapi);
  openapi.get("/subscribe/:filename", RouteSubscribe);
  return app;
}
