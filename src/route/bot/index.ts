import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import { appBotWebhook } from "./webhook";
import { newBot } from "@/lib/bot";

export const appBot = new OpenAPIHono();

appBot.route("/webhook", appBotWebhook);

appBot.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Send Message to Chat",
    method: "post",
    path: "/send",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              chat_id: z
                .number()
                .positive()
                .int()
                .openapi({ example: 1111111111 }),
              text: z.string(),
              parse_mode: z.enum(["HTML", "Markdown", "MarkdownV2"]).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
      },
    },
  }),
  async (c) => {
    const { chat_id, text, parse_mode } = c.req.valid("json");
    const bot = newBot(c.env as any);
    const response = await bot.api.sendMessage(chat_id, text, {
      parse_mode: parse_mode,
    });
    return c.json(response);
  },
);
