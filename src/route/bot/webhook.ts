import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { webhookCallback } from "grammy";
import { HTTPException } from "hono/http-exception";

import { newBot } from "@/lib/bot";

export const appBotWebhook = new OpenAPIHono();

appBotWebhook.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Telegram Bot Webhook",
    method: "post",
    path: "/",
    responses: {
      200: {
        description: "OK",
      },
    },
  }),
  (c) => {
    const bot = newBot(c.env?.BOT_TOKEN as string);
    bot.api.setWebhook(c.req.url);
    const callback = webhookCallback(bot, "cloudflare-mod");
    return callback(c.req);
  },
);

appBotWebhook.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Set Telegram Bot Webhook",
    method: "get",
    path: "/set/{uuid}",
    request: {
      params: z.object({ uuid: z.string().uuid() }),
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "text/plain": {
            schema: z
              .string()
              .url()
              .openapi({ example: "https://api.liblaf.me/bot/webhook" }),
          },
        },
      },
      403: {
        description: "Forbidden",
      },
    },
  }),
  async (c) => {
    const { uuid } = c.req.valid("param");
    if (uuid !== c.env?.MY_UUID) throw new HTTPException(403);
    const bot = newBot(c.env?.BOT_TOKEN as string);
    const url = c.req.url.replace(/\/set\/.+$/, "");
    await bot.api.setWebhook(url);
    return c.text(url);
  },
);
