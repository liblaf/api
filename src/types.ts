import type { Context as HonoContext } from "hono";

export type Context = HonoContext<{ Bindings: CloudflareBindings }>;
