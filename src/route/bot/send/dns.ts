import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import { newBot } from "@/lib/bot";

export const appBotSendDns = new OpenAPIHono();

const DnsRecordSchema = z.object({
  name: z.string().openapi({ example: "example.com" }),
  content: z.string().openapi({ example: "8.8.8.8" }),
});

appBotSendDns.openapi(
  createRoute({
    tags: ["Bot"],
    summary: "Send DNS update message to chat",
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
              create: z.array(DnsRecordSchema).default([]),
              delete: z.array(DnsRecordSchema).default([]),
              keep: z.array(DnsRecordSchema).default([]),
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
    const { create, delete: del, keep } = c.req.valid("json");
    const bot = newBot(c.env as any);
    let message: string = "<b>🟢 Create</b> <b>🔴 Delete</b> <b>🔵 Keep</b>\n";
    for (const record of create)
      message += `🟢 <code>${record.name}</code> => <code>${record.content}</code>\n`;
    for (const record of del)
      message += `🔴 <code>${record.name}</code> => <code>${record.content}</code>\n`;
    for (const record of keep)
      message += `🔵 <code>${record.name}</code> => <code>${record.content}</code>\n`;
    message = message.trim();
    const response = await bot.api.sendMessage(chat_id, message, {
      parse_mode: "HTML",
    });
    return c.json(response);
  },
);
