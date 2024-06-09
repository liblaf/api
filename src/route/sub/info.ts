import { createRoute, z } from "@hono/zod-openapi";
import { newApp } from "@lib/bindings";
import { type Info, InfoSchema, fetchInfoSafe } from "@lib/sub/info";
import { preprocessArray } from "@lib/zod-utils";
import { HTTPException } from "hono/http-exception";

export const appSubInfo = newApp();

const responseSchema = z.object({
	info: z.array(InfoSchema),
});

appSubInfo.openapi(
	createRoute({
		tags: ["Subscription"],
		summary: "Get subscription user info",
		method: "get",
		path: "/",
		request: {
			query: z.object({
				url: z.preprocess(preprocessArray, z.array(z.string().url())),
			}),
		},
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": {
						schema: responseSchema,
					},
				},
			},
		},
	}),
	async (c) => {
		const { url } = c.req.valid("query");
		const info: Info[] = await fetchInfoSafe(
			url.map((url: string) => new URL(url)),
		);
		return c.json({ info: info });
	},
);

appSubInfo.openapi(
	createRoute({
		tags: ["Subscription"],
		summary: "Get my subscription info",
		method: "get",
		path: "/{uuid}",
		request: {
			params: z.object({
				uuid: z.string().uuid(),
			}),
		},
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": {
						schema: responseSchema,
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
		const urls: URL[] = c.env.MY_SUB_URLS.split("\n").map(
			(url: string) => new URL(url),
		);
		const info: Info[] = await fetchInfoSafe(urls);
		return c.json({ info: info });
	},
);
