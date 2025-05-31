import { OpenAPIHono } from "@hono/zod-openapi";

export type App = OpenAPIHono<{ Bindings: CloudflareBindings }>;

export function createApp(): App {
  return new OpenAPIHono<{ Bindings: CloudflareBindings }>();
}
