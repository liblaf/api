import { createRoute, z } from "@hono/zod-openapi";
import { newApp } from "@lib/bindings";
import { newBot } from "@lib/bot";
import { webhookCallback } from "grammy";

export const appBotWebhook = newApp();

appBotWebhook.openapi(
	createRoute({
		tags: ["Bot"],
		summary: "Set Telegram bot webhook",
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
	async (c) => {
		const bot = newBot(c.env);
		const url = c.req.url;
		await bot.api.setWebhook(c.req.url);
		return c.text(url);
	},
);

appBotWebhook.openapi(
	createRoute({
		tags: ["Bot"],
		summary: "Telegram bot webhook",
		method: "post",
		path: "/",
		responses: {
			200: {
				description: "OK",
			},
		},
	}),
	async (c) => {
		const bot = newBot(c.env);
		const callback = webhookCallback(bot, "cloudflare-mod");
		const response = callback(c.req.raw);
		return response;
	},
);
