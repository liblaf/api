import { OpenAPIHono } from "@hono/zod-openapi";

export function createApp(): OpenAPIHono<{ Bindings: CloudflareBindings }> {
  return new OpenAPIHono<{ Bindings: CloudflareBindings }>();
}
