import { OpenAPIHono } from "@hono/zod-openapi";

export type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

export function createApp() {
  return new OpenAPIHono<{ Bindings: Bindings }>();
}
