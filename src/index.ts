import type { Hono } from "hono";
import { createApp } from "./app";

const app: Hono<{ Bindings: CloudflareBindings }> = createApp();

export default app;
