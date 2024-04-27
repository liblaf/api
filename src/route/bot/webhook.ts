import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { webhookCallback } from "grammy";
import { HTTPException } from "hono/http-exception";

import { newBot } from "@/lib/bot";

export const appBotWebhook = new OpenAPIHono();

appBotWebhook.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Set Telegram Bot Webhook",
    method: "get",
    path: "/",
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
    },
  }),
  // @ts-ignore
  async (c) => {
    const bot = newBot(c.env as any);
    const url = c.req.url;
    await bot.api.setWebhook(c.req.url);
    return c.text(url);
  },
);

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
  async (c) => {
    const bot = newBot(c.env as any);
    const callback = webhookCallback(bot, "cloudflare-mod");
    const response = callback(c.req.raw);
    return response;
  },
);
