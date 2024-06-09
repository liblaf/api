import { OpenAPIHono } from "@hono/zod-openapi";

export type Bindings = {
	[key in keyof CloudflareBindings]: CloudflareBindings[key];
};

export function newApp() {
	return new OpenAPIHono<{ Bindings: Bindings }>();
}
