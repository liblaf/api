import { createRoute, z } from "@hono/zod-openapi";
import { newApp } from "@lib/bindings";
import { convert } from "@lib/sub/sing-box/convert";
import { type Query, QuerySchema } from "@lib/sub/sing-box/query";
import { preprocessArray } from "@lib/zod-utils";
import { HTTPException } from "hono/http-exception";

export const appSubConvertSingBox = newApp();

appSubConvertSingBox.openapi(
	createRoute({
		tags: ["Subscription"],
		summary: "Convert subscription to sing-box config",
		method: "get",
		path: "/",
		request: {
			query: QuerySchema.extend({
				url: z.preprocess(preprocessArray, z.array(z.string().url())),
			}),
		},
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": {
						schema: z.any({ description: "sing-box config" }),
					},
				},
			},
		},
	}),
	async (c) => {
		const { url, ...query } = c.req.valid("query");
		const config = await convert(
			url.map((url) => new URL(url)),
			query,
		);
		return c.json(config);
	},
);

appSubConvertSingBox.openapi(
	createRoute({
		tags: ["Subscription"],
		summary: "Get my sing-box config",
		method: "get",
		path: "/{uuid}",
		request: {
			params: z.object({
				uuid: z.string().uuid(),
			}),
			query: QuerySchema,
		},
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": {
						schema: z.any({ description: "sing-box config" }),
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
		if (uuid !== c.env.MY_UUID) throw new HTTPException(403);
		const urls: URL[] = (c.env.MY_SUB_URLS as string)
			.split("\n")
			.map((url) => new URL(url));
		const query: Query = c.req.valid("query");
		const config = await convert(urls, query);
		return c.json(config);
	},
);
