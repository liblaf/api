import { OpenAPIHono } from "@hono/zod-openapi";

import { appBotWebhook } from "./webhook";

export const appBot = new OpenAPIHono();

appBot.route("/webhook", appBotWebhook);
