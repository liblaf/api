import { OpenAPIHono } from "@hono/zod-openapi";

import { appBotWebhook } from "./webhook";
import { appBotSend } from "./send";

export const appBot = new OpenAPIHono();

appBot.route("/send", appBotSend);
appBot.route("/webhook", appBotWebhook);
