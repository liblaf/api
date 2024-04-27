import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import { newBot } from "@/lib/bot";
import { appBotSendDns } from "./dns";

export const appBotSend = new OpenAPIHono();

appBotSend.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Send message to chat",
    method: "post",
    path: "/{chat_id}",
    request: {
      params: z.object({
        chat_id: z.coerce
          .number()
          .positive()
          .int()
          .openapi({ example: 1111111111 }),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              text: z.string().openapi({ example: "Hello, world!" }),
              parse_mode: z.enum(["Markdown", "MarkdownV2", "HTML"]).optional(),
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
    const { chat_id } = c.req.valid("param");
    const { text, parse_mode } = c.req.valid("json");
    const bot = newBot(c.env as any);
    const response = await bot.api.sendMessage(chat_id, text, {
      parse_mode: parse_mode,
    });
    return c.json(response);
  },
);

appBotSend.route("/dns", appBotSendDns);
